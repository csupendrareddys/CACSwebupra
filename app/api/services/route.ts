import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const serviceStmt = db.prepare('SELECT * FROM document_related_services WHERE document_id = ?');
            const service = serviceStmt.get(id);

            if (!service) {
                return NextResponse.json({ error: 'Service not found' }, { status: 404 });
            }

            // Mocking requirements until we have a dedicated table
            let requiredDocuments: { name: string }[] = [];

            // Check based on name pattern
            const name = service.document_type || '';

            if (name.includes('Partnership')) {
                requiredDocuments = [
                    { name: 'PAN Card of All Partners' },
                    { name: 'Aadhar Card of All Partners' },
                    { name: 'Partnership Deed Draft (if available)' },
                    { name: 'Address Proof of Business' },
                    { name: 'Passport Size Photos' }
                ];
            } else if (name.includes('GST')) {
                requiredDocuments = [
                    { name: 'PAN Card' },
                    { name: 'Aadhar Card' },
                    { name: 'Bank Account Details' },
                    { name: 'Address Proof' }
                ];
            } else if (name.includes('Company')) {
                requiredDocuments = [
                    { name: 'Director ID Proofs' },
                    { name: 'Address Proof' },
                    { name: 'DIN (Director Identification Number)' },
                    { name: 'DSC (Digital Signature Certificate)' }
                ];
            } else {
                requiredDocuments = [
                    { name: 'Standard ID Proof' },
                    { name: 'Related Legal Documents' }
                ];
            }

            return NextResponse.json({ service: { ...service, requirements: requiredDocuments } }, { status: 200 });
        }

        const stmt = db.prepare('SELECT * FROM document_related_services WHERE is_active = 1 ORDER BY created_at DESC');
        const services = stmt.all();

        return NextResponse.json({ services }, { status: 200 });
    } catch (error: any) {
        console.error("Failed to fetch services:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
