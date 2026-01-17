import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullName, email, password } = body;

        if (!fullName || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const checkStmt = db.prepare('SELECT user_id FROM users WHERE email = ?');
        const existingUser = checkStmt.get(email);

        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const username = email.split('@')[0]; // Simple username generation

        // Insert new user
        // Using "Service_reciver" as default role based on schema constraints
        const insertStmt = db.prepare(`
            INSERT INTO users (username, password_hash, email, first_name, role)
            VALUES (?, ?, ?, ?, 'Service_reciver')
        `);

        // We store fullName in first_name for now as schema supports first/last
        const info = insertStmt.run(username, hashedPassword, email, fullName);

        // Also create an entry in service_receivers as per schema logic (optional but good for consistency)
        const insertReceiverStmt = db.prepare('INSERT INTO service_receivers (user_id, first_name) VALUES (?, ?)');
        insertReceiverStmt.run(info.lastInsertRowid, fullName);

        return NextResponse.json({ message: 'User registered successfully', userId: info.lastInsertRowid }, { status: 201 });

<<<<<<< HEAD
    } catch (error: unknown) {
        console.error('CRITICAL ERROR in signup API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
=======
    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
>>>>>>> 3532a83911a9264d85309278bbcbd06497d358f0
    }
}
