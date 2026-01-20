import prisma from '@/lib/db';

/**
 * Seed script to populate initial ServiceRequirements
 * Run with: npx ts-node prisma/seed-requirements.ts
 * Or: npx tsx prisma/seed-requirements.ts
 */

async function seedRequirements() {
    console.log('Seeding service requirements...');

    // Get all services
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
                    id: `${service.id}-req-${i}` // Using a deterministic ID for upsert
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

    console.log('Done seeding requirements!');
}

seedRequirements()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
