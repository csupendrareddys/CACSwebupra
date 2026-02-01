import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

/**
 * GET /api/admin/vouchers - List all vouchers
 */
export async function GET() {
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const vouchers = await prisma.voucher.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ 
            vouchers: vouchers.map(v => ({
                ...v,
                discountValue: Number(v.discountValue),
                minOrderAmount: v.minOrderAmount ? Number(v.minOrderAmount) : null,
                maxDiscount: v.maxDiscount ? Number(v.maxDiscount) : null
            }))
        });
    } catch (error) {
        console.error('Get vouchers error:', error);
        return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
    }
}

/**
 * POST /api/admin/vouchers - Create a new voucher
 */
export async function POST(req: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const body = await req.json();
        const { 
            code, 
            discountType = 'PERCENTAGE', 
            discountValue, 
            maxUses, 
            minOrderAmount, 
            maxDiscount,
            validUntil 
        } = body;

        if (!code || !discountValue) {
            return NextResponse.json(
                { error: 'Code and discount value are required' },
                { status: 400 }
            );
        }

        // Check if code already exists
        const existing = await prisma.voucher.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Voucher code already exists' },
                { status: 400 }
            );
        }

        const voucher = await prisma.voucher.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                discountValue,
                maxUses: maxUses || null,
                minOrderAmount: minOrderAmount || null,
                maxDiscount: maxDiscount || null,
                validUntil: validUntil ? new Date(validUntil) : null,
                isActive: true
            }
        });

        return NextResponse.json({ 
            message: 'Voucher created successfully',
            voucher 
        }, { status: 201 });

    } catch (error) {
        console.error('Create voucher error:', error);
        return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
    }
}

/**
 * PUT /api/admin/vouchers - Update a voucher
 */
export async function PUT(req: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const body = await req.json();
        const { id, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'Voucher ID is required' }, { status: 400 });
        }

        await prisma.voucher.update({
            where: { id },
            data: { isActive }
        });

        return NextResponse.json({ message: 'Voucher updated successfully' });
    } catch (error) {
        console.error('Update voucher error:', error);
        return NextResponse.json({ error: 'Failed to update voucher' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/vouchers - Delete a voucher
 */
export async function DELETE(req: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Voucher ID is required' }, { status: 400 });
        }

        await prisma.voucher.delete({ where: { id } });

        return NextResponse.json({ message: 'Voucher deleted successfully' });
    } catch (error) {
        console.error('Delete voucher error:', error);
        return NextResponse.json({ error: 'Failed to delete voucher' }, { status: 500 });
    }
}
