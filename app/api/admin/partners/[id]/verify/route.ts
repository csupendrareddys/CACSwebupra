import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

/**
 * PATCH /api/admin/partners/[id]/verify - Update partner verification status
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) {
            return authResult.response;
        }

        const { id } = await params;
        const body = await req.json();
        const { status, reason } = body;

        // Validate status
        const validStatuses = ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be one of: PENDING, VERIFIED, REJECTED, SUSPENDED' },
                { status: 400 }
            );
        }

        // Find the partner
        const partner = await prisma.serviceProvider.findUnique({
            where: { id },
            include: { user: { select: { email: true } } }
        });

        if (!partner) {
            return NextResponse.json(
                { error: 'Partner not found' },
                { status: 404 }
            );
        }

        // Update verification status
        const updatedPartner = await prisma.serviceProvider.update({
            where: { id },
            data: {
                verificationStatus: status
            },
            include: {
                user: { select: { email: true } }
            }
        });

        // TODO: Send email notification to partner about status change

        return NextResponse.json({
            message: `Partner verification status updated to ${status}`,
            partner: {
                id: updatedPartner.id,
                email: updatedPartner.user.email,
                fullName: updatedPartner.fullName,
                verificationStatus: updatedPartner.verificationStatus
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to update partner verification:', error);
        return NextResponse.json(
            { error: 'Failed to update partner verification' },
            { status: 500 }
        );
    }
}
