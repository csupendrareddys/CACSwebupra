import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// Prevent build-time crash if DATABASE_URL is missing
const prismaClientSingleton = () => {
    // If we are in a build environment and no DB URL is present, usage of Prisma might fail 
    // but instantiation shouldn't if we don't query. 
    // However, specifically to pass 'new PrismaClient()', if it checks env:
    return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma



