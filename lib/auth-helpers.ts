import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Helper function to check if the current user is an admin.
 * Use this in API routes that require admin access.
 * 
 * @returns The session if user is admin, or a 401/403 response
 */
export async function requireAdmin() {
    const session = await auth();

    if (!session?.user) {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "Unauthorized: Not authenticated" },
                { status: 401 }
            ),
        };
    }

    if (session.user.role !== "ADMIN") {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            ),
        };
    }

    return {
        authorized: true as const,
        session,
    };
}

/**
 * Helper function to check if the current user is authenticated.
 * Use this in API routes that require any authenticated user.
 * 
 * @returns The session if authenticated, or a 401 response
 */
export async function requireAuth() {
    const session = await auth();

    if (!session?.user) {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "Unauthorized: Not authenticated" },
                { status: 401 }
            ),
        };
    }

    return {
        authorized: true as const,
        session,
    };
}

/**
 * Helper function to check if the current user is a partner.
 * Use this in API routes that require partner access.
 * 
 * @returns The session if user is a partner, or a 401/403 response
 */
export async function requirePartner() {
    const session = await auth();

    if (!session?.user) {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "Unauthorized: Not authenticated" },
                { status: 401 }
            ),
        };
    }

    if (session.user.role !== "PARTNER" && session.user.role !== "ADMIN") {
        return {
            authorized: false as const,
            response: NextResponse.json(
                { error: "Forbidden: Partner access required" },
                { status: 403 }
            ),
        };
    }

    return {
        authorized: true as const,
        session,
    };
}
