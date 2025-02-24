import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';

export default async function isAdmin(): Promise<boolean> {
    const { sessionClaims }: ClerkMiddlewareAuthObject = await auth();
    type SessionClaims = { metadata?: { role?: string } };
    const claims: SessionClaims = sessionClaims as SessionClaims;
    return claims.metadata?.role === 'admin';
}
