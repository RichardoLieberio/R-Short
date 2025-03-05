import { ReactNode, JSX } from 'react';
import { ClerkClient } from '@clerk/backend';
import { auth, clerkClient, User as ClerkUser, ClerkMiddlewareAuthObject } from '@clerk/nextjs/server';
import { db, User } from '@database';

export default async function ClerkAuth({ children }: { children: ReactNode }): Promise<JSX.Element> {
    const { userId, sessionClaims }: ClerkMiddlewareAuthObject = await auth();

    type SessionClaims = { metadata?: { registered?: boolean } };
    const claims: SessionClaims = sessionClaims as SessionClaims;

    if (userId && !claims.metadata?.registered) {
        const client: ClerkClient = await clerkClient();
        const user: ClerkUser = await client.users.getUser(userId);
        const email: string = user.emailAddresses[0].emailAddress;

        const [ { role } ]: { role: 'user' | 'admin' }[] = await db.insert(User)
            .values({ clerk_id: userId, email })
            .onConflictDoUpdate({ target: User.email, set: { clerk_id: userId } })
            .returning({ role: User.role });

        await client.users.updateUserMetadata(userId, {
            publicMetadata: { role, registered: true },
        });
    }

    return (
        <>{ children }</>
    );
}
