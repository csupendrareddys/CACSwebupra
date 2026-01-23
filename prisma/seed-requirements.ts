import prisma from '@/lib/db';

/**
 * Seed script to populate initial Services and ServiceRequirements
 * Run with: npx tsx prisma/seed-requirements.ts
 */

const DEFAULT_SERVICES = [
    { documentType: 'PAN Card Update', state: 'All India' },
    { documentType: 'Aadhar Card Update', state: 'All India' },
    { documentType: 'GST Registration', state: 'All India' },
    { documentType: 'Partnership Deed Registration', state: 'All India' },
    { documentType: 'Private Limited Company Registration', state: 'All India' },
    { documentType: 'Trade License', state: 'Maharashtra' },
    { documentType: 'Rental Agreement', state: 'All India' }
];

async function seedRequirements() {
    console.log('Seeding services and requirements...');

    // 1. Seed Services
    for (const serviceData of DEFAULT_SERVICES) {
        await prisma.documentService.upsert({
            where: { id: `service-${serviceData.documentType.replace(/\s+/g, '-').toLowerCase()}` },
            update: {
                documentType: serviceData.documentType,
                state: serviceData.state,
                isActive: true
            },
            create: {
                id: `service-${serviceData.documentType.replace(/\s+/g, '-').toLowerCase()}`,
                documentType: serviceData.documentType,
                state: serviceData.state,
                isActive: true
            }
        });
    }

    // 2. Get all services (now seeded)
    const services = await prisma.documentService.findMany();

    for (const service of services) {
        const name = service.documentType || '';
        let requirements: { name: string; description?: string }[] = [];

        if (name.includes('Partnership')) {
            requirements = [
                { name: 'PAN Card of All Partners', description: 'Valid PAN card copies of all partners' },
                { name: 'Aadhar Card of All Partners', description: 'Aadhar card copies for identity verification' },
                { name: 'Partnership Deed Draft', description: 'Draft of partnership deed if available' },
                { name: 'Address Proof of Business', description: 'Utility bill, rent agreement, or property documents' },
                { name: 'Passport Size Photos', description: '2 passport size photos of each partner' }
            ];
        } else if (name.includes('GST')) {
            requirements = [
                { name: 'PAN Card', description: 'Valid PAN card of the business/individual' },
                { name: 'Aadhar Card', description: 'Aadhar card for identity verification' },
                { name: 'Bank Account Details', description: 'Cancelled cheque or bank statement' },
                { name: 'Address Proof', description: 'Business address proof document' }
            ];
        } else if (name.includes('Company')) {
            requirements = [
                { name: 'Director ID Proofs', description: 'PAN and Aadhar of all directors' },
                { name: 'Address Proof', description: 'Registered office address proof' },
                { name: 'DIN', description: 'Director Identification Number (if already obtained)' },
                { name: 'DSC', description: 'Digital Signature Certificate (if already obtained)' }
            ];
        } else {
            requirements = [
                { name: 'Standard ID Proof', description: 'Government issued ID proof' },
                { name: 'Related Legal Documents', description: 'Any relevant legal documents for the service' }
            ];
        }

        // Create requirements for this service
        for (let i = 0; i < requirements.length; i++) {
            await prisma.serviceRequirement.upsert({
                where: {
                    id: `${service.id}-req-${i}`
                },
                update: {
                    name: requirements[i].name,
                    description: requirements[i].description,
                    sortOrder: i
                },
                create: {
                    id: `${service.id}-req-${i}`,
                    serviceId: service.id,
                    name: requirements[i].name,
                    description: requirements[i].description,
                    sortOrder: i,
                    isRequired: true
                }
            });
        }

        console.log(`✓ Seeded ${requirements.length} requirements for: ${service.documentType}`);
    }

    console.log('Done seeding services and requirements!');
}

seedRequirements()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
