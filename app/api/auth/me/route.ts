import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
    const sessionToken = req.cookies.get('session_token')?.value;

    if (!sessionToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: { include: { serviceProvider: true, serviceReceiver: true } } }
    });

    if (!session || session.expires < new Date()) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Return safe user data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = session.user;
    return NextResponse.json({ user: safeUser }, { status: 200 });
}
