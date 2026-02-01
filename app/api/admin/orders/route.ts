import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
    // RBAC: Verify admin access
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const orders = await prisma.order.findMany({
            include: {
                service: { select: { documentType: true } },
                customer: {
                    select: {
                        fullName: true,
                        user: { select: { email: true } }
                    }
                },
                provider: {
                    select: {
                        fullName: true,
                        user: { select: { email: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedOrders = orders.map(o => ({
            id: o.id,
            service: o.service.documentType,
            customer: o.customer.fullName,
            customerEmail: o.customer.user.email,
            provider: o.provider?.fullName || null,
            providerEmail: o.provider?.user.email || null,
            status: o.status,
            paymentStatus: o.paymentStatus,
            finalPrice: o.finalPrice ? Number(o.finalPrice) : null,
            createdAt: o.createdAt
        }));

        return NextResponse.json({ orders: formattedOrders }, { status: 200 });
    } catch (error: unknown) {
        console.error('Admin Orders API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    // RBAC: Verify admin access
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const body = await req.json();
        const { orderId, status, providerId } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        if (!status && !providerId) {
            return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                ...(status && { status }),
                ...(providerId && { providerId })
            }
        });

        return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
    } catch (error: unknown) {
        console.error('Admin Order Update Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
