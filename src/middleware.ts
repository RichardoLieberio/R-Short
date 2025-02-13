import { NextRequest } from 'next/server';
import { createRouteMatcher, clerkMiddleware, ClerkMiddlewareAuth } from '@clerk/nextjs/server';

type isPublicRouteType = (req: NextRequest) => boolean;
const isPublicRoute: isPublicRouteType = createRouteMatcher([ '/', '/register(.*)', '/login(.*)' ]);

export default clerkMiddleware(async function (auth: ClerkMiddlewareAuth, request: NextRequest): Promise<void> {
    if (!isPublicRoute(request)) await auth.protect();
});

export const config: { matcher: string[] } = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
