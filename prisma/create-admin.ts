import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    console.log('Creating admin user...');

    const email = 'admin@cacsupra.com';
    const password = 'AdminPassword123!';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            role: 'ADMIN',
            status: 'ACTIVE',
            isEmailVerified: true,
        },
        create: {
            email,
            passwordHash,
            role: 'ADMIN',
            status: 'ACTIVE',
            isEmailVerified: true,
        },
    });

    console.log(`
    ✅ Admin user created/updated!
    --------------------------------
    Email:    ${email}
    Password: ${password}
    Role:     ${user.role}
    --------------------------------
    `);
}

createAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
