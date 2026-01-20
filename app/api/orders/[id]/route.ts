import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/orders/[id] - Get order details
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAuth();
        if (!authResult.authorized) {
            return authResult.response;
        }

        const { id } = await params;
        const { session } = authResult;
        const userRole = session.user.role;
        const userId = session.user.id;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                service: {
                    include: { requirements: { orderBy: { sortOrder: 'asc' } } }
                },
                customer: {
                    include: { user: { select: { email: true } } }
                },
                provider: {
                    include: { user: { select: { email: true } } }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Authorization check
        if (userRole === 'CLIENT') {
            const serviceReceiver = await prisma.serviceReceiver.findUnique({
                where: { userId }
            });
            if (order.customerId !== serviceReceiver?.id) {
                return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
                );
            }
        } else if (userRole === 'PARTNER') {
            const serviceProvider = await prisma.serviceProvider.findUnique({
                where: { userId }
            });
            // Partner can see their assigned orders OR available orders
            if (order.providerId && order.providerId !== serviceProvider?.id) {
                return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
                );
            }
        }
        // ADMIN can see all orders

        return NextResponse.json({
            order: {
                id: order.id,
                service: {
                    id: order.service.id,
                    documentType: order.service.documentType,
                    state: order.service.state,
                    requirements: order.service.requirements.map(r => ({
                        id: r.id,
                        name: r.name,
                        description: r.description,
                        isRequired: r.isRequired
                    }))
                },
                customer: {
                    id: order.customer.id,
                    fullName: order.customer.fullName,
                    email: order.customer.user.email,
                    phone: order.customer.phone
                },
                provider: order.provider ? {
                    id: order.provider.id,
                    fullName: order.provider.fullName,
                    email: order.provider.user.email,
                    phone: order.provider.phone
                } : null,
                status: order.status,
                paymentStatus: order.paymentStatus,
                finalPrice: order.finalPrice,
                rating: order.ratingByUser,
                remarks: order.remarksByUser,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to fetch order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/orders/[id] - Update order status
 * - CLIENT: can cancel their own order (if not yet processing)
 * - PARTNER: can update status to PROCESSING/COMPLETED
 * - ADMIN: can update any status
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAuth();
        if (!authResult.authorized) {
            return authResult.response;
        }

        const { id } = await params;
        const { session } = authResult;
        const userRole = session.user.role;
        const userId = session.user.id;

        const body = await req.json();
        const { status, rating, remarks } = body;

        const order = await prisma.order.findUnique({
            where: { id },
            include: { customer: true, provider: true }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        const updateData: Record<string, unknown> = {};

        if (userRole === 'CLIENT') {
            const serviceReceiver = await prisma.serviceReceiver.findUnique({
                where: { userId }
            });
            if (order.customerId !== serviceReceiver?.id) {
                return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
                );
            }

            // Client can only cancel if order not yet processing
            if (status === 'CANCELLED' && ['CREATED', 'PAYMENT_PENDING'].includes(order.status)) {
                updateData.status = 'CANCELLED';
            }

            // Client can add rating/remarks after completion
            if (order.status === 'COMPLETED') {
                if (rating !== undefined) updateData.ratingByUser = rating;
                if (remarks !== undefined) updateData.remarksByUser = remarks;
            }

        } else if (userRole === 'PARTNER') {
            const serviceProvider = await prisma.serviceProvider.findUnique({
                where: { userId }
            });
            if (order.providerId !== serviceProvider?.id) {
                return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
                );
            }

            // Partner can update to PROCESSING or COMPLETED
            if (['PROCESSING', 'COMPLETED'].includes(status)) {
                updateData.status = status;
            }

        } else if (userRole === 'ADMIN') {
            // Admin can update anything
            if (status) updateData.status = status;
            if (rating !== undefined) updateData.ratingByUser = rating;
            if (remarks !== undefined) updateData.remarksByUser = remarks;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'No valid updates provided' },
                { status: 400 }
            );
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            message: 'Order updated successfully',
            order: {
                id: updatedOrder.id,
                status: updatedOrder.status,
                paymentStatus: updatedOrder.paymentStatus,
                rating: updatedOrder.ratingByUser,
                remarks: updatedOrder.remarksByUser
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
