import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch single service with its requirements from DB
            const service = await prisma.documentService.findUnique({
                where: { id },
                include: {
                    requirements: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });

            if (!service) {
                return NextResponse.json({ error: 'Service not found' }, { status: 404 });
            }

            return NextResponse.json({
                service: {
                    document_id: service.id,
                    document_type: service.documentType,
                    state: service.state,
                    is_active: service.isActive,
                    requirements: service.requirements.map(r => ({
                        id: r.id,
                        name: r.name,
                        description: r.description,
                        isRequired: r.isRequired
                    }))
                }
            }, { status: 200 });
        }

        // List all active services
        const services = await prisma.documentService.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        const formattedServices = services.map(s => ({
            document_id: s.id,
            document_type: s.documentType,
            state: s.state,
            is_active: s.isActive
        }));

        return NextResponse.json({ services: formattedServices }, { status: 200 });
    } catch (error: unknown) {
        console.error("Failed to fetch services:", error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

