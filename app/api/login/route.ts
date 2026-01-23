import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // 1. Validate User
        const user = await prisma.user.findUnique({
            where: { email },
            include: { serviceProvider: true, serviceReceiver: true } // Include profile data
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Create Session in DB
        const sessionToken = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await prisma.session.create({
            data: {
                sessionToken,
                userId: user.id,
                expires: expiresAt,
            }
        });

        // 3. Prepare Response with HttpOnly Cookie
        const response = NextResponse.json({
            message: 'Login successful',
            // Do NOT send sensitive data here, the cookie handles auth now
            role: user.role
        }, { status: 200 });

        response.cookies.set('session_token', sessionToken, {
            httpOnly: true, // JavaScript cannot read this (prevents XSS)
            secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
            sameSite: 'lax',
            path: '/',
            expires: expiresAt
        });

        return response;

    } catch (error: unknown) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
