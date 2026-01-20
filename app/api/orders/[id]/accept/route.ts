import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePartner } from '@/lib/auth-helpers';

/**
 * POST /api/orders/[id]/accept - Partner accepts an available order (marketplace model)
 * Only verified partners can accept orders
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requirePartner();
        if (!authResult.authorized) {
            return authResult.response;
        }

        const { id } = await params;
        const { session } = authResult;
        const userId = session.user.id;

        // Get partner's service provider profile
        const serviceProvider = await prisma.serviceProvider.findUnique({
            where: { userId }
        });

        if (!serviceProvider) {
            return NextResponse.json(
                { error: 'Partner profile not found' },
                { status: 404 }
            );
        }

        // Check if partner is verified
        if (serviceProvider.verificationStatus !== 'VERIFIED') {
            return NextResponse.json(
                { error: 'Only verified partners can accept orders' },
                { status: 403 }
            );
        }

        // Get the order
        const order = await prisma.order.findUnique({
            where: { id },
            include: { service: true }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if order is available for acceptance
        if (order.providerId !== null) {
            return NextResponse.json(
                { error: 'Order has already been assigned to a partner' },
                { status: 400 }
            );
        }

        if (order.status !== 'PAYMENT_COMPLETED') {
            return NextResponse.json(
                { error: 'Order is not ready for acceptance (payment not completed)' },
                { status: 400 }
            );
        }

        // Assign the order to the partner
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                providerId: serviceProvider.id,
                status: 'PROCESSING'
            },
            include: {
                service: true,
                customer: {
                    include: { user: { select: { email: true } } }
                }
            }
        });

        return NextResponse.json({
            message: 'Order accepted successfully',
            order: {
                id: updatedOrder.id,
                service: updatedOrder.service.documentType,
                customer: updatedOrder.customer.fullName,
                status: updatedOrder.status,
                createdAt: updatedOrder.createdAt
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to accept order:', error);
        return NextResponse.json(
            { error: 'Failed to accept order' },
            { status: 500 }
        );
    }
}
