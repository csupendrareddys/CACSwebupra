import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { Profession } from '@prisma/client';
import { sendWelcomeEmail } from '@/lib/email';

// Map profession strings to enum
function mapProfession(profession: string): Profession {
    const mapping: Record<string, Profession> = {
        'Chartered Accountant': 'CA',
        'Company Secretary': 'CS',
        'Lawyer': 'LAWYER',
        'Other': 'OTHER',
        'CA': 'CA',
        'CS': 'CS',
        'LAWYER': 'LAWYER',
        'OTHER': 'OTHER'
    };
    return mapping[profession] || 'OTHER';
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullName, email, password, phone, profession, otherProfession } = body;

        if (!fullName || !email || !password || !phone || !profession) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and service provider in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    role: 'PARTNER',
                }
            });

            await tx.serviceProvider.create({
                data: {
                    userId: user.id,
                    fullName,
                    phone,
                    profession: mapProfession(profession),
                    otherProfession: otherProfession || null,
                    verificationStatus: 'PENDING',
                }
            });

            return user;
        });

        // Send welcome email (don't await - fire and forget)
        sendWelcomeEmail(email, fullName).catch(console.error);

        return NextResponse.json({
            message: 'Partner registered successfully',
            userId: result.id
        }, { status: 201 });

    } catch (error: unknown) {
        console.error('CRITICAL ERROR in partner signup API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

