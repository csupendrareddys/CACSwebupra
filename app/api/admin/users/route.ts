import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        // Fetch users with their partner status if applicable
        const users = await prisma.user.findMany({
            include: {
                serviceProvider: {
                    select: {
                        verificationStatus: true,
                        profession: true,
                        fullName: true
                    }
                },
                serviceReceiver: {
                    select: {
                        fullName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedUsers = users.map(user => ({
            user_id: user.id,
            email: user.email,
            role: user.role,
            user_status: user.status,
            verification_status: user.serviceProvider?.verificationStatus,
            profession: user.serviceProvider?.profession,
            first_name: user.serviceProvider?.fullName || user.serviceReceiver?.fullName || null,
            username: user.email.split('@')[0]
        }));

        return NextResponse.json({ users: formattedUsers }, { status: 200 });
    } catch (error: unknown) {
        console.error('Admin Users API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, action } = body;
        // action: 'VERIFY_PARTNER' | 'BLOCK_USER' | 'ACTIVATE_USER'

        if (!userId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (action === 'VERIFY_PARTNER') {
            const updated = await prisma.serviceProvider.update({
                where: { userId },
                data: { verificationStatus: 'VERIFIED' }
            });
            if (!updated) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }
        else if (action === 'BLOCK_USER') {
            await prisma.user.update({
                where: { id: userId },
                data: { status: 'BLOCKED' }
            });
        }
        else if (action === 'ACTIVATE_USER') {
            await prisma.user.update({
                where: { id: userId },
                data: { status: 'ACTIVE' }
            });
        }
        else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Action completed successfully' }, { status: 200 });

    } catch (error: unknown) {
        console.error('Admin User Update Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
