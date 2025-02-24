import { NextRequest } from 'next/server';
import { createRouteMatcher, clerkMiddleware, ClerkMiddlewareAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import isAdmin from '@/utils/isAdmin';

type routeType = (req: NextRequest) => boolean;
const isPublicRoute: routeType = createRouteMatcher([ '/', '/register(.*)', '/login(.*)' ]);
const isAdminRoute: routeType = createRouteMatcher([ '/admin(.*)' ]);

export default clerkMiddleware(async function (auth: ClerkMiddlewareAuth, request: NextRequest): Promise<NextResponse | void> {
    if (!isPublicRoute(request)) await auth.protect();
    if (isAdminRoute(request) && !isAdmin()) return NextResponse.redirect(new URL('/', request.url));
});

export const config: { matcher: string[] } = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
