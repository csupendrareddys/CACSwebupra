import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
    // RBAC: Verify admin access
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        // Get counts in parallel for efficiency
        const [
            totalUsers,
            totalClients,
            totalPartners,
            pendingPartners,
            verifiedPartners,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalServices,
            activeServices,
            recentOrders,
            recentUsers
        ] = await Promise.all([
            // User counts
            prisma.user.count(),
            prisma.user.count({ where: { role: 'CLIENT' } }),
            prisma.user.count({ where: { role: 'PARTNER' } }),
            prisma.serviceProvider.count({ where: { verificationStatus: 'PENDING' } }),
            prisma.serviceProvider.count({ where: { verificationStatus: 'VERIFIED' } }),
            
            // Order counts
            prisma.order.count(),
            prisma.order.count({ where: { status: { in: ['CREATED', 'PAYMENT_PENDING', 'PROCESSING'] } } }),
            prisma.order.count({ where: { status: 'COMPLETED' } }),
            
            // Service counts
            prisma.documentService.count(),
            prisma.documentService.count({ where: { isActive: true } }),
            
            // Recent orders (last 5)
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    service: { select: { documentType: true } },
                    customer: { select: { fullName: true } }
                }
            }),
            
            // Recent users (last 5)
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true
                }
            })
        ]);

        // Calculate revenue (sum of completed orders with finalPrice)
        const revenueData = await prisma.order.aggregate({
            where: { paymentStatus: 'SUCCESS' },
            _sum: { finalPrice: true }
        });

        const stats = {
            users: {
                total: totalUsers,
                clients: totalClients,
                partners: totalPartners
            },
            partners: {
                pending: pendingPartners,
                verified: verifiedPartners
            },
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                completed: completedOrders
            },
            services: {
                total: totalServices,
                active: activeServices
            },
            revenue: {
                total: revenueData._sum.finalPrice?.toNumber() || 0
            },
            recent: {
                orders: recentOrders.map(o => ({
                    id: o.id,
                    service: o.service.documentType,
                    customer: o.customer.fullName,
                    status: o.status,
                    createdAt: o.createdAt
                })),
                users: recentUsers
            }
        };

        return NextResponse.json({ stats }, { status: 200 });
    } catch (error: unknown) {
        console.error('Admin Stats API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
