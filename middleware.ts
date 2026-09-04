import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security Headers
    const headers = response.headers;

    // Prevent clickjacking attacks
    headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    headers.set('X-Content-Type-Options', 'nosniff');

    // Enable XSS protection
    headers.set('X-XSS-Protection', '1; mode=block');

    // Referrer policy
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy
    headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
    );

    // Content Security Policy
    const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.cloudinary.com https://*.cloudinary.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: http:",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.cloudinary.com https://*.cloudinary.com",
        "media-src 'self' https://*.cloudinary.com blob:",
        "frame-src 'self' https://widget.cloudinary.com https://upload-widget.cloudinary.com https://www.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
    ];

    // Only upgrade insecure requests in production
    if (process.env.NODE_ENV === 'production') {
        cspDirectives.push("upgrade-insecure-requests");
    }

    headers.set('Content-Security-Policy', cspDirectives.join('; '));

    // Strict Transport Security (HTTPS only) - only in production
    if (process.env.NODE_ENV === 'production') {
        headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }

    return response;
}

// Apply middleware to all routes except static files
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
