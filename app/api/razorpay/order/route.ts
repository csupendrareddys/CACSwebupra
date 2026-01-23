import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { requireAuth } from '@/lib/auth-helpers';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: NextRequest) {
    try {
        const authResult = await requireAuth();
        if (!authResult.authorized) return authResult.response;

        const body = await req.json();
        const { amount, currency = 'INR' } = body;

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        // Razorpay amount is in paisa (100 paisa = 1 Rupee)
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error('Razorpay Error:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}
