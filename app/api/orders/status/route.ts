import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/orders/status - Poll for order status updates
 * Returns orders updated since the given timestamp
 */
export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth();
        if (!authResult.authorized) {
            return authResult.response;
        }

        const { session } = authResult;
        const userId = session.user.id;
        const userRole = session.user.role;

        const { searchParams } = new URL(req.url);
        const sinceParam = searchParams.get('since');
        const since = sinceParam ? new Date(sinceParam) : new Date(Date.now() - 60000); // Default: last minute

        const whereClause: Record<string, unknown> = {
            updatedAt: { gt: since }
        };

        if (userRole === 'CLIENT') {
            const serviceReceiver = await prisma.serviceReceiver.findUnique({
                where: { userId }
            });
            if (!serviceReceiver) {
                return NextResponse.json({ updates: [], timestamp: new Date().toISOString() });
            }
            whereClause.customerId = serviceReceiver.id;
        } else if (userRole === 'PARTNER') {
            const serviceProvider = await prisma.serviceProvider.findUnique({
                where: { userId }
            });
            if (!serviceProvider) {
                return NextResponse.json({ updates: [], timestamp: new Date().toISOString() });
            }
            whereClause.providerId = serviceProvider.id;
        }
        // ADMIN sees all updates

        const updates = await prisma.order.findMany({
            where: whereClause,
            select: {
                id: true,
                status: true,
                paymentStatus: true,
                updatedAt: true,
                service: { select: { documentType: true } }
            },
            orderBy: { updatedAt: 'desc' },
            take: 10
        });

        return NextResponse.json({
            updates: updates.map(o => ({
                orderId: o.id,
                status: o.status,
                paymentStatus: o.paymentStatus,
                service: o.service.documentType,
                updatedAt: o.updatedAt
            })),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Failed to fetch status updates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch updates' },
            { status: 500 }
        );
    }
}
