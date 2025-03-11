import { NextRequest, NextResponse } from 'next/server';
import { createRouteMatcher, clerkMiddleware, ClerkMiddlewareAuth, ClerkMiddlewareAuthObject } from '@clerk/nextjs/server';

type routeType = (req: NextRequest) => boolean;
const isPublicRoute: routeType = createRouteMatcher([ '/', '/register(.*)', '/login(.*)', '/api/payment/success' ]);
const isAdminRoute: routeType = createRouteMatcher([ '/admin(.*)' ]);

export default clerkMiddleware(async function (auth: ClerkMiddlewareAuth, request: NextRequest): Promise<NextResponse | void> {
    if (!isPublicRoute(request)) await auth.protect();
    if (isAdminRoute(request)) {
        const { sessionClaims }: ClerkMiddlewareAuthObject = await auth();

        type SessionClaims = { metadata?: { role?: string } };
        const claims: SessionClaims = sessionClaims as SessionClaims;

        if (claims.metadata?.role !== 'admin') return NextResponse.redirect(new URL('/', request.url));
    }
});

export const config: { matcher: string[] } = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
