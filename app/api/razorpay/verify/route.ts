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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = body;

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
        // Note: 'PAYMENT_COMPLETED' and 'SUCCESS' must match your schema.
        // Assuming 'paymentStatus' and 'status' fields exist on Order model.
        // If schema is different, this might need adjustment.
        await prisma.order.update({
            where: { id: dbOrderId },
            data: {
                paymentStatus: 'SUCCESS',
                status: 'PAYMENT_COMPLETED'
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Verification Error", error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
