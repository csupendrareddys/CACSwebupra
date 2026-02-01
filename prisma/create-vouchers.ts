import prisma from '@/lib/db';

async function createTestVoucher() {
    console.log('Creating test voucher...');

    // Create a 100% discount voucher for testing
    const voucher = await prisma.voucher.upsert({
        where: { code: 'TESTFREE100' },
        update: {
            discountType: 'PERCENTAGE',
            discountValue: 100,
            maxUses: 10,
            maxDiscount: 10000, // Max ₹10,000 discount
            isActive: true,
            validUntil: new Date('2026-12-31')
        },
        create: {
            code: 'TESTFREE100',
            discountType: 'PERCENTAGE',
            discountValue: 100,
            maxUses: 10,
            maxDiscount: 10000,
            isActive: true,
            validUntil: new Date('2026-12-31')
        }
    });

    // Create a flat ₹500 off voucher
    const voucher2 = await prisma.voucher.upsert({
        where: { code: 'FLAT500' },
        update: {
            discountType: 'FIXED',
            discountValue: 500,
            maxUses: 50,
            minOrderAmount: 999,
            isActive: true,
            validUntil: new Date('2026-12-31')
        },
        create: {
            code: 'FLAT500',
            discountType: 'FIXED',
            discountValue: 500,
            maxUses: 50,
            minOrderAmount: 999,
            isActive: true,
            validUntil: new Date('2026-12-31')
        }
    });

    // Create a 20% off voucher
    const voucher3 = await prisma.voucher.upsert({
        where: { code: 'SAVE20' },
        update: {
            discountType: 'PERCENTAGE',
            discountValue: 20,
            maxUses: 100,
            maxDiscount: 2000, // Max ₹2000 discount
            isActive: true,
            validUntil: new Date('2026-12-31')
        },
        create: {
            code: 'SAVE20',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            maxUses: 100,
            maxDiscount: 2000,
            isActive: true,
            validUntil: new Date('2026-12-31')
        }
    });

    console.log(`
    ✅ Test vouchers created!
    ================================
    
    1. TESTFREE100
       - 100% OFF (Max ₹10,000)
       - For testing the full checkout flow
       - ${voucher.maxUses} uses remaining
    
    2. FLAT500
       - ₹500 OFF
       - Min order: ₹999
       - ${voucher2.maxUses} uses remaining
    
    3. SAVE20
       - 20% OFF (Max ₹2,000)
       - No minimum order
       - ${voucher3.maxUses} uses remaining
    
    ================================
    `);
}

createTestVoucher()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
