import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

/**
 * GET /api/admin/partners - List all partners with optional status filter
 */
export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) {
            return authResult.response;
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status'); // PENDING, VERIFIED, REJECTED, SUSPENDED
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const whereClause: Record<string, unknown> = {};

        if (status) {
            whereClause.verificationStatus = status;
        }

        const [partners, total] = await Promise.all([
            prisma.serviceProvider.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            status: true,
                            createdAt: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.serviceProvider.count({ where: whereClause })
        ]);

        const formattedPartners = partners.map(partner => ({
            id: partner.id,
            userId: partner.userId,
            email: partner.user.email,
            fullName: partner.fullName,
            phone: partner.phone,
            profession: partner.profession,
            otherProfession: partner.otherProfession,
            verificationStatus: partner.verificationStatus,
            documentsUrl: partner.documentsUrl,
            rating: partner.rating,
            userStatus: partner.user.status,
            createdAt: partner.createdAt,
            updatedAt: partner.updatedAt
        }));

        return NextResponse.json({
            partners: formattedPartners,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to fetch partners:', error);
        return NextResponse.json(
            { error: 'Failed to fetch partners' },
            { status: 500 }
        );
    }
}
