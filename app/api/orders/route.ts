import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';
import { sendOrderConfirmationEmail } from '@/lib/email';

/**
 * POST /api/orders - Create a new order
 * Only authenticated clients can create orders
 */
export async function POST(req: NextRequest) {
    try {
        const authResult = await requireAuth();
        if (!authResult.authorized) {
            return authResult.response;
        }

        const { session } = authResult;
        const userId = session.user.id;

        const body = await req.json();
        const { serviceId, remarks } = body;

        if (!serviceId) {
            return NextResponse.json(
                { error: 'Service ID is required' },
                { status: 400 }
            );
        }

        // Verify service exists
        const service = await prisma.documentService.findUnique({
            where: { id: serviceId }
        });

        if (!service || !service.isActive) {
            return NextResponse.json(
                { error: 'Service not found or inactive' },
                { status: 404 }
            );
        }

        // Get or create ServiceReceiver profile for the client
        let serviceReceiver = await prisma.serviceReceiver.findUnique({
            where: { userId }
        });

        if (!serviceReceiver) {
            // Create a minimal profile if it doesn't exist
            serviceReceiver = await prisma.serviceReceiver.create({
                data: {
                    userId,
                    fullName: session.user.name || session.user.email || 'Unknown'
                }
            });
        }

        // Create the order
        const order = await prisma.order.create({
            data: {
                serviceId,
                customerId: serviceReceiver.id,
                status: 'CREATED',
                paymentStatus: 'PENDING',
                remarksByUser: remarks || null
            },
            include: {
                service: true,
                customer: {
                    include: { user: { select: { email: true } } }
                }
            }
        });

        // Send order confirmation email (fire and forget)
        sendOrderConfirmationEmail(
            order.customer.user.email,
            order.customer.fullName,
            order.id,
            order.service.documentType
        ).catch(console.error);

        return NextResponse.json({
            message: 'Order created successfully',
            order: {
                id: order.id,
                service: order.service.documentType,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Failed to create order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}


/**
 * GET /api/orders - List orders
 * - CLIENT: sees own orders
 * - PARTNER: sees available orders (no provider assigned) + their assigned orders
 * - ADMIN: sees all orders
 */
export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth();
        if (!authResult.authorized) {
            return authResult.response;
        }

        const { session } = authResult;
        const userRole = session.user.role;
        const userId = session.user.id;

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const whereClause: Record<string, unknown> = {};

        if (status) {
            whereClause.status = status;
        }

        if (userRole === 'CLIENT') {
            // Get client's service receiver ID
            const serviceReceiver = await prisma.serviceReceiver.findUnique({
                where: { userId }
            });

            if (!serviceReceiver) {
                return NextResponse.json({ orders: [], total: 0 }, { status: 200 });
            }

            whereClause.customerId = serviceReceiver.id;

        } else if (userRole === 'PARTNER') {
            // Get partner's service provider ID
            const serviceProvider = await prisma.serviceProvider.findUnique({
                where: { userId }
            });

            if (!serviceProvider) {
                return NextResponse.json({ orders: [], total: 0 }, { status: 200 });
            }

            // Check if partner is verified
            if (serviceProvider.verificationStatus !== 'VERIFIED') {
                return NextResponse.json(
                    { error: 'Partner must be verified to view orders' },
                    { status: 403 }
                );
            }

            const available = searchParams.get('available') === 'true';

            if (available) {
                // Show orders without provider (marketplace)
                whereClause.providerId = null;
                whereClause.status = 'PAYMENT_COMPLETED'; // Only paid orders are available
            } else {
                // Show partner's assigned orders
                whereClause.providerId = serviceProvider.id;
            }

        } else if (userRole === 'ADMIN') {
            // Admin can see all orders, no filter needed
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: whereClause,
                include: {
                    service: true,
                    customer: {
                        include: { user: { select: { email: true } } }
                    },
                    provider: {
                        include: { user: { select: { email: true } } }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.order.count({ where: whereClause })
        ]);

        const formattedOrders = orders.map(order => ({
            id: order.id,
            service: order.service.documentType,
            customer: order.customer.fullName,
            customerEmail: order.customer.user.email,
            provider: order.provider?.fullName || null,
            providerEmail: order.provider?.user.email || null,
            status: order.status,
            paymentStatus: order.paymentStatus,
            finalPrice: order.finalPrice,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        return NextResponse.json({
            orders: formattedOrders,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
