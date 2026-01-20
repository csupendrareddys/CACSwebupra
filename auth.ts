import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                // Fetch user from database
                const user = await prisma.user.findUnique({
                    where: { email },
                    include: {
                        serviceProvider: true,
                        serviceReceiver: true,
                    },
                });

                if (!user) {
                    return null;
                }

                // Verify password
                const isValid = await bcrypt.compare(password, user.passwordHash);
                if (!isValid) {
                    return null;
                }

                // Check partner verification status
                if (user.role === 'PARTNER' && user.serviceProvider) {
                    const verificationStatus = user.serviceProvider.verificationStatus;
                    if (verificationStatus === 'PENDING') {
                        throw new Error('Your account is pending verification. Please wait for admin approval.');
                    }
                    if (verificationStatus === 'REJECTED') {
                        throw new Error('Your verification was rejected. Please contact support.');
                    }
                    if (verificationStatus === 'SUSPENDED') {
                        throw new Error('Your account has been suspended. Please contact support.');
                    }
                }

                // Get display name from profile
                const name = user.serviceProvider?.fullName
                    || user.serviceReceiver?.fullName
                    || user.email;

                // Return user object for session
                return {
                    id: user.id,
                    email: user.email,
                    name: name,
                    role: user.role,
                    status: user.status,
                };
            },
        }),
    ],
});

