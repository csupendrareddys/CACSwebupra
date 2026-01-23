import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
    const sessionToken = req.cookies.get('session_token')?.value;

    if (sessionToken) {
        // Delete session from DB
        await prisma.session.deleteMany({
            where: { sessionToken }
        });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    // Clear cookie
    response.cookies.set('session_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });

    return response;
}
