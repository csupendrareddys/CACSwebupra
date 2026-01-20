import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
    // RBAC: Verify admin access
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const services = await prisma.documentService.findMany({
            orderBy: { createdAt: 'desc' }
        });

        const formattedServices = services.map(s => ({
            document_id: s.id,
            document_type: s.documentType,
            state: s.state,
            is_active: s.isActive,
            created_at: s.createdAt
        }));

        return NextResponse.json({ services: formattedServices }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // RBAC: Verify admin access
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const body = await req.json();
        const { document_type, state, is_active } = body;

        if (!document_type) {
            return NextResponse.json({ error: 'Service name is required' }, { status: 400 });
        }

        const service = await prisma.documentService.create({
            data: {
                documentType: document_type,
                state: state || 'All India',
                isActive: is_active ?? true,
            }
        });

        return NextResponse.json({ message: 'Service added', id: service.id }, { status: 201 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    // RBAC: Verify admin access
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
        return authResult.response;
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.documentService.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Service deleted' }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
