import { authMiddleware } from "./auth.config";

// Export the edge-compatible auth middleware
// Route protection logic is handled in auth.config.ts authorized callback
export default authMiddleware;

export const config = {
    matcher: [
        // Match all routes except static files and API routes
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};

