import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const stmt = db.prepare('SELECT * FROM document_related_services ORDER BY created_at DESC');
        const services = stmt.all();
        return NextResponse.json({ services }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { document_type, state, is_active } = body;

        if (!document_type) {
            return NextResponse.json({ error: 'Service name is required' }, { status: 400 });
        }

        const stmt = db.prepare('INSERT INTO document_related_services (document_type, state, is_active) VALUES (?, ?, ?)');
        const info = stmt.run(document_type, state || 'All India', is_active ? 1 : 0);

        return NextResponse.json({ message: 'Service added', id: info.lastInsertRowid }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const stmt = db.prepare('DELETE FROM document_related_services WHERE document_id = ?');
        stmt.run(id);

        return NextResponse.json({ message: 'Service deleted' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
