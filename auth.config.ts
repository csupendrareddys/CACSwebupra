import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// This is a shared config used by both edge-compatible middleware and full server-side auth
// The authorize function is only used server-side, so we defer the actual credential validation
export const authConfig = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            // This will be overridden in auth.ts for server-side use
            async authorize() {
                // Placeholder - actual implementation is in auth.ts
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            // On initial sign in, add user info to token
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.status = user.status;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            // Add user info from token to session
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.status = token.status as string;
            }
            return session;
        },
        // This callback is edge-compatible and handles route protection
        async authorized({ auth, request }: { auth: any; request: Request }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = new URL(request.url);

            // Define protected routes
            const protectedRoutes = ["/dashboard", "/admin"];
            const adminRoutes = ["/admin"];
            const authRoutes = ["/login", "/signup", "/partners", "/admin-login"];

            const isProtectedRoute = protectedRoutes.some((route) =>
                pathname.startsWith(route)
            );
            const isAdminRoute = adminRoutes.some((route) =>
                pathname.startsWith(route)
            );
            const isAuthRoute = authRoutes.some((route) =>
                pathname.startsWith(route)
            );

            // Redirect authenticated users away from auth pages
            if (isLoggedIn && isAuthRoute) {
                return Response.redirect(new URL("/dashboard", request.url));
            }

            // Redirect unauthenticated users from protected routes to login
            if (!isLoggedIn && isProtectedRoute) {
                const loginUrl = new URL("/login", request.url);
                loginUrl.searchParams.set("callbackUrl", pathname);
                return Response.redirect(loginUrl);
            }

            // Check admin access for admin routes
            if (isLoggedIn && isAdminRoute && auth?.user?.role !== "ADMIN") {
                return Response.redirect(new URL("/dashboard", request.url));
            }

            return true;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" as const,
        maxAge: 24 * 60 * 60, // 24 hours
    },
    trustHost: true,
};

// Edge-compatible auth export for middleware
export const { auth: authMiddleware } = NextAuth(authConfig);
