import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

/**
 * POST /api/orders/[id]/assign - Admin assigns an order to a specific partner
 */
export async function POST(
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
        const { providerId } = body;

        if (!providerId) {
            return NextResponse.json(
                { error: 'Provider ID is required' },
                { status: 400 }
            );
        }

        // Verify the order exists
        const order = await prisma.order.findUnique({
            where: { id }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify the provider exists and is verified
        const serviceProvider = await prisma.serviceProvider.findUnique({
            where: { id: providerId },
            include: { user: { select: { email: true } } }
        });

        if (!serviceProvider) {
            return NextResponse.json(
                { error: 'Provider not found' },
                { status: 404 }
            );
        }

        if (serviceProvider.verificationStatus !== 'VERIFIED') {
            return NextResponse.json(
                { error: 'Cannot assign order to unverified partner' },
                { status: 400 }
            );
        }

        // Assign the order
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                providerId: serviceProvider.id,
                status: order.status === 'PAYMENT_COMPLETED' ? 'PROCESSING' : order.status
            },
            include: {
                service: true,
                customer: {
                    include: { user: { select: { email: true } } }
                },
                provider: {
                    include: { user: { select: { email: true } } }
                }
            }
        });

        return NextResponse.json({
            message: 'Order assigned successfully',
            order: {
                id: updatedOrder.id,
                service: updatedOrder.service.documentType,
                customer: updatedOrder.customer.fullName,
                provider: updatedOrder.provider?.fullName,
                providerEmail: updatedOrder.provider?.user.email,
                status: updatedOrder.status
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to assign order:', error);
        return NextResponse.json(
            { error: 'Failed to assign order' },
            { status: 500 }
        );
    }
}
