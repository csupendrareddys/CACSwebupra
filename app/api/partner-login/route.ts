import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        // Fetch user
        // Partner login might check if the user has a 'Service_provider' role or related entry
        const stmt = db.prepare(`
            SELECT u.*, sp.verification_status 
            FROM users u 
            LEFT JOIN service_providers sp ON u.user_id = sp.user_id
            WHERE u.email = ?
        `);
        const user = stmt.get(email);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check Role
        if (user.role !== 'Service_provider' && user.role !== 'Super_Admin' && user.role !== 'Sub_Admin') {
            return NextResponse.json({ error: 'Unauthorized: Not a partner account' }, { status: 403 });
        }

        // Successful login
        return NextResponse.json({
            message: 'Partner Login successful',
            user: {
                id: user.user_id,
                email: user.email,
                name: user.first_name,
                role: user.role,
                status: user.verification_status
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Partner Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
