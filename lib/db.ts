import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const prismaClientSingleton = () => {
    // Check if DATABASE_URL is present. 
    // If not, we can assume we are in a build context without env vars.
    // We pass a dummy URL to satisfy the Prisma constructor validation.
    // This allows the build to pass, but the app will crash at runtime if 
    // it tries to query the DB without a real URL (which is expected).
    const url = process.env.DATABASE_URL;

    if (!url) {
        return new PrismaClient({
            datasources: {
                db: {
                    url: "postgresql://dummy:dummy@localhost:5432/dummy"
                }
            }
        });
    }

    return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
