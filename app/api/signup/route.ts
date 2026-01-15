import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
    console.log("API: Signup POST received");
    try {
        const body = await req.json();
        console.log("API: Request body:", body);
        const { fullName, email, password } = body;

        if (!fullName || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Prepare data for Google Sheet
        // Assuming columns: Full Name, Email, Password (Plaintext for now as requested/demo), Date
        const newRow = {
            "Full Name": fullName,
            "Email": email,
            "Password": password, // Warning: In production, never store passwords in plaintext!
            "Date": new Date().toISOString()
        };

        await appendToSheet(newRow);

        return NextResponse.json({ message: 'User registered successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('CRITICAL ERROR in signup API:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
