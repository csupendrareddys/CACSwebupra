import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullName, email, password, phone, profession, otherProfession } = body;

        if (!fullName || !email || !password || !phone || !profession) {
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
        const username = email.split('@')[0];

        // Insert into users table as Service_provider
        const insertUserStmt = db.prepare(`
            INSERT INTO users (username, password_hash, email, first_name, phone_number, role)
            VALUES (?, ?, ?, ?, ?, 'Service_provider')
        `);

        // Start transaction
        const transaction = db.transaction(() => {
            const info = insertUserStmt.run(username, hashedPassword, email, fullName, phone);
            const userId = info.lastInsertRowid;

            // Insert into service_providers table
            const insertProviderStmt = db.prepare(`
                INSERT INTO service_providers (user_id, first_name, profession, other_profession, verification_status)
                VALUES (?, ?, ?, ?, 'PENDING')
            `);

            insertProviderStmt.run(userId, fullName, profession, otherProfession || null);
            return userId;
        });

        const newUserId = transaction();

        return NextResponse.json({ message: 'Partner registered successfully', userId: newUserId }, { status: 201 });

<<<<<<< HEAD
    } catch (error: unknown) {
        console.error('CRITICAL ERROR in partner signup API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
=======
    } catch (error: any) {
        console.error('Partner Signup Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
>>>>>>> 3532a83911a9264d85309278bbcbd06497d358f0
    }
}
