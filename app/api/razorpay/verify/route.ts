import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
    try {
        // Also verify user is authenticated, though the payment itself has limits
        const authResult = await requireAuth();
        if (!authResult.authorized) return authResult.response;

        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId, freeOrder } = body;

        // Handle FREE orders (100% discount vouchers)
        if (freeOrder && dbOrderId) {
            await prisma.order.update({
                where: { id: dbOrderId },
                data: {
                    paymentStatus: 'SUCCESS',
                    status: 'PAYMENT_COMPLETED',
                    finalPrice: 0
                }
            });

            // Increment voucher usage if voucher was used
            const order = await prisma.order.findUnique({
                where: { id: dbOrderId },
                select: { voucherCode: true }
            });

            if (order?.voucherCode) {
                await prisma.voucher.update({
                    where: { code: order.voucherCode },
                    data: { currentUses: { increment: 1 } }
                });
            }

            return NextResponse.json({ success: true, message: 'Free order processed' });
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Verify Signature
        const bodyData = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || "")
            .update(bodyData.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 2. Update Database (Payment Successful)
        await prisma.order.update({
            where: { id: dbOrderId },
            data: {
                paymentStatus: 'SUCCESS',
                status: 'PAYMENT_COMPLETED'
            }
        });

        // 3. Increment voucher usage if voucher was used
        const order = await prisma.order.findUnique({
            where: { id: dbOrderId },
            select: { voucherCode: true }
        });

        if (order?.voucherCode) {
            await prisma.voucher.update({
                where: { code: order.voucherCode },
                data: { currentUses: { increment: 1 } }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Verification Error", error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
