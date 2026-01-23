import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get('session_token')?.value;
    const { pathname } = request.nextUrl;

    // Protected Routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        if (!sessionToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
