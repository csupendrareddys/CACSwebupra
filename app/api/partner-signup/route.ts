import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    console.log("API: Partner Signup POST received");
    try {
        const body = await req.json();
        console.log("API: Request body:", body);
        const { fullName, phone, email, profession, otherProfession, password } = body;

        if (!fullName || !phone || !email || !profession || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newRow = {
            "Full Name": fullName,
            "Phone": phone,
            "Email": email,
            "Profession": profession,
            "Other Profession": otherProfession || "", // Handle optional
            "Password": password,
            "Date": new Date().toISOString()
        };

        // await appendPartner(newRow); // Google Sheets integration removed
        console.log("Would save to sheet:", newRow);

        return NextResponse.json({ message: 'Partner registered successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('CRITICAL ERROR in partner signup API:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
