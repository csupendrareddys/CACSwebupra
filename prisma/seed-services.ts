import prisma from '../lib/db';

const services = [
    // GST Services
    { documentType: "GST Registration", state: "All India" },
    { documentType: "GST Return Filing", state: "All India" },
    { documentType: "GST Annual Return", state: "All India" },
    { documentType: "GST Cancellation", state: "All India" },
    
    // Income Tax Services
    { documentType: "Income Tax Return", state: "All India" },
    { documentType: "TDS Return Filing", state: "All India" },
    { documentType: "Tax Audit", state: "All India" },
    
    // MCA/Company Services
    { documentType: "Private Limited Company", state: "All India" },
    { documentType: "One Person Company", state: "All India" },
    { documentType: "LLP Registration", state: "All India" },
    { documentType: "Proprietorship", state: "All India" },
    { documentType: "Partnership Firm", state: "All India" },
    { documentType: "Section 8 Company", state: "All India" },
    { documentType: "Producer Company", state: "All India" },
    { documentType: "Nidhi Company", state: "All India" },
    { documentType: "Public Limited Company", state: "All India" },
    { documentType: "Registered Office Change", state: "All India" },
    { documentType: "Director Addition", state: "All India" },
    { documentType: "Director Removal", state: "All India" },
    { documentType: "Share Transfer", state: "All India" },
    { documentType: "Increase Authorized Capital", state: "All India" },
    { documentType: "MOA Amendment", state: "All India" },
    { documentType: "AOA Amendment", state: "All India" },
    { documentType: "Annual Compliance - Company", state: "All India" },
    { documentType: "Annual Compliance - LLP", state: "All India" },
    { documentType: "Company Winding Up", state: "All India" },
    { documentType: "LLP Winding Up", state: "All India" },
    
    // Trademark Services
    { documentType: "Trademark Registration", state: "All India" },
    { documentType: "Trademark Objection", state: "All India" },
    { documentType: "Trademark Opposition", state: "All India" },
    { documentType: "Trademark Renewal", state: "All India" },
    { documentType: "Trademark Assignment", state: "All India" },
    { documentType: "Copyright Registration", state: "All India" },
    { documentType: "Patent Registration", state: "All India" },
    
    // Registration Services
    { documentType: "MSME Registration", state: "All India" },
    { documentType: "Udyam Registration", state: "All India" },
    { documentType: "FSSAI Registration", state: "All India" },
    { documentType: "FSSAI License", state: "All India" },
    { documentType: "Import Export Code", state: "All India" },
    { documentType: "ISO Certification", state: "All India" },
    { documentType: "Digital Signature Certificate", state: "All India" },
    { documentType: "ESI Registration", state: "All India" },
    { documentType: "PF Registration", state: "All India" },
    { documentType: "Professional Tax Registration", state: "All India" },
    { documentType: "Shop Act License", state: "All India" },
    { documentType: "Trade License", state: "All India" },
    
    // Startup Services
    { documentType: "Startup India Registration", state: "All India" },
    { documentType: "Seed Fund Application", state: "All India" },
    { documentType: "Angel Tax Exemption", state: "All India" },
    { documentType: "Pitch Deck Preparation", state: "All India" },
    
    // Compliance Services
    { documentType: "ROC Filing", state: "All India" },
    { documentType: "DIN KYC", state: "All India" },
    { documentType: "Company Name Change", state: "All India" },
    { documentType: "Commencement of Business", state: "All India" },
    
    // International Services  
    { documentType: "USA Company", state: "International" },
    { documentType: "UK Company", state: "International" },
    { documentType: "UAE Company", state: "International" },
    { documentType: "Singapore Company", state: "International" },
    { documentType: "Hong Kong Company", state: "International" },
];

async function seedServices() {
    console.log('Seeding services...\n');

    let created = 0;
    let existing = 0;

    for (const service of services) {
        const exists = await prisma.documentService.findFirst({
            where: { documentType: service.documentType }
        });

        if (!exists) {
            await prisma.documentService.create({
                data: {
                    documentType: service.documentType,
                    state: service.state,
                    isActive: true
                }
            });
            created++;
            console.log(`  ✅ Created: ${service.documentType}`);
        } else {
            existing++;
        }
    }

    console.log(`\n========================================`);
    console.log(`  Services Created: ${created}`);
    console.log(`  Already Existed: ${existing}`);
    console.log(`  Total Services: ${created + existing}`);
    console.log(`========================================\n`);
}

seedServices()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
