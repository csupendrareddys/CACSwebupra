import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        // In a real app, middleware would verify the session/token here to ensure admin access.

        // Fetch users with their partner status if applicable
        // SQLite doesn't support RIGHT JOIN, so we use LEFT JOIN from users
        const stmt = db.prepare(`
            SELECT 
                u.user_id, 
                u.username, 
                u.email, 
                u.first_name, 
                u.role, 
                u.status as user_status,
                sp.verification_status,
                sp.profession
            FROM users u
            LEFT JOIN service_providers sp ON u.user_id = sp.user_id
            ORDER BY u.created_at DESC
        `);

        const users = stmt.all();

        return NextResponse.json({ users }, { status: 200 });
    } catch (error: any) {
        console.error('Admin Users API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, action } = body;
        // action: 'VERIFY_PARTNER' | 'BLOCK_USER' | 'ACTIVATE_USER'

        if (!userId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (action === 'VERIFY_PARTNER') {
            const stmt = db.prepare('UPDATE service_providers SET verification_status = ? WHERE user_id = ?');
            const info = stmt.run('VERIFIED', userId);
            if (info.changes === 0) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }
        else if (action === 'BLOCK_USER') {
            const stmt = db.prepare('UPDATE users SET status = ? WHERE user_id = ?');
            stmt.run('BLOCKED', userId);
        }
        else if (action === 'ACTIVATE_USER') {
            const stmt = db.prepare('UPDATE users SET status = ? WHERE user_id = ?');
            stmt.run('ACTIVE', userId);
        }
        else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Action completed successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Admin User Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
