import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * POST /api/vouchers/validate - Validate a voucher code
 * Public API - anyone can check if a voucher is valid
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, orderAmount } = body;

        if (!code) {
            return NextResponse.json(
                { error: 'Voucher code is required' },
                { status: 400 }
            );
        }

        // Find the voucher
        const voucher = await prisma.voucher.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!voucher) {
            return NextResponse.json(
                { valid: false, error: 'Invalid voucher code' },
                { status: 404 }
            );
        }

        // Check if active
        if (!voucher.isActive) {
            return NextResponse.json(
                { valid: false, error: 'This voucher is no longer active' },
                { status: 400 }
            );
        }

        // Check validity period
        const now = new Date();
        if (voucher.validFrom > now) {
            return NextResponse.json(
                { valid: false, error: 'This voucher is not yet valid' },
                { status: 400 }
            );
        }

        if (voucher.validUntil && voucher.validUntil < now) {
            return NextResponse.json(
                { valid: false, error: 'This voucher has expired' },
                { status: 400 }
            );
        }

        // Check usage limit
        if (voucher.maxUses && voucher.currentUses >= voucher.maxUses) {
            return NextResponse.json(
                { valid: false, error: 'This voucher has reached its usage limit' },
                { status: 400 }
            );
        }

        // Check minimum order amount
        const amount = orderAmount ? Number(orderAmount) : 0;
        if (voucher.minOrderAmount && amount < Number(voucher.minOrderAmount)) {
            return NextResponse.json(
                { valid: false, error: `Minimum order amount is ₹${voucher.minOrderAmount}` },
                { status: 400 }
            );
        }

        // Calculate discount
        let discount = 0;
        if (voucher.discountType === 'PERCENTAGE') {
            discount = (amount * Number(voucher.discountValue)) / 100;
            // Apply max discount cap if set
            if (voucher.maxDiscount && discount > Number(voucher.maxDiscount)) {
                discount = Number(voucher.maxDiscount);
            }
        } else {
            // FIXED discount
            discount = Number(voucher.discountValue);
        }

        // Don't allow discount more than order amount
        if (discount > amount) {
            discount = amount;
        }

        return NextResponse.json({
            valid: true,
            voucher: {
                code: voucher.code,
                discountType: voucher.discountType,
                discountValue: Number(voucher.discountValue),
                maxDiscount: voucher.maxDiscount ? Number(voucher.maxDiscount) : null
            },
            discount: Math.round(discount),
            finalAmount: Math.round(amount - discount),
            message: voucher.discountType === 'PERCENTAGE' 
                ? `${voucher.discountValue}% discount applied!`
                : `₹${voucher.discountValue} discount applied!`
        });

    } catch (error) {
        console.error('Voucher validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate voucher' },
            { status: 500 }
        );
    }
}
