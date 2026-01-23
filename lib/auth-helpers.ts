import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Helper type for the session object pattern
type AuthResult =
    | { authorized: false; response: NextResponse }
    | { authorized: true; session: { user: { id: string; role: string; email: string; name?: string } } };

/**
 * Internal helper to validate session token
 */
async function getSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) return null;

    const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: { include: { serviceProvider: true, serviceReceiver: true } } }
    });

    if (!session || session.expires < new Date()) {
        return null;
    }

    return session;
}

/**
 * Helper function to check if the current user is an admin.
 */
export async function requireAdmin(): Promise<AuthResult> {
    const session = await getSession();

    if (!session?.user) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Unauthorized: Not authenticated" },
                { status: 401 }
            ),
        };
    }

    if (session.user.role !== "ADMIN") {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            ),
        };
    }

    return {
        authorized: true,
        session: {
            user: {
                id: session.user.id,
                role: session.user.role,
                email: session.user.email,
                name: session.user.serviceProvider?.fullName || session.user.serviceReceiver?.fullName
            }
        },
    };
}

/**
 * Helper function to check if the current user is authenticated.
 */
export async function requireAuth(): Promise<AuthResult> {
    const session = await getSession();

    if (!session?.user) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Unauthorized: Not authenticated" },
                { status: 401 }
            ),
        };
    }

    return {
        authorized: true,
        session: {
            user: {
                id: session.user.id,
                role: session.user.role,
                email: session.user.email,
                name: session.user.serviceProvider?.fullName || session.user.serviceReceiver?.fullName
            }
        },
    };
}

/**
 * Helper function to check if the current user is a partner.
 */
export async function requirePartner(): Promise<AuthResult> {
    const session = await getSession();

    if (!session?.user) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Unauthorized: Not authenticated" },
                { status: 401 }
            ),
        };
    }

    if (session.user.role !== "PARTNER" && session.user.role !== "ADMIN") {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Forbidden: Partner access required" },
                { status: 403 }
            ),
        };
    }

    return {
        authorized: true,
        session: {
            user: {
                id: session.user.id,
                role: session.user.role,
                email: session.user.email,
                name: session.user.serviceProvider?.fullName || session.user.serviceReceiver?.fullName
            }
        },
    };
}
