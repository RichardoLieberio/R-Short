import { ReactNode, JSX } from 'react';
import { ClerkMiddlewareAuthObject, auth, clerkClient, User as ClerkUser } from '@clerk/nextjs/server';
import { ClerkClient } from '@clerk/backend';
import { db, User, Log, logs } from '@database';

export default async function ClerkAuth({ children }: { children: ReactNode }): Promise<JSX.Element> {
    const { userId, sessionClaims }: ClerkMiddlewareAuthObject = await auth();

    type SessionClaims = { metadata?: { registered?: boolean } };
    const claims: SessionClaims = sessionClaims as SessionClaims;

    if (userId && !claims.metadata?.registered) {
        const client: ClerkClient = await clerkClient();
        const user: ClerkUser = await client.users.getUser(userId);
        const email: string = user.emailAddresses[0].emailAddress;

        await db.transaction(async (tx) => {
            await Promise.all([
                tx.insert(User)
                    .values({ clerk_id: userId, email })
                    .onConflictDoUpdate({ target: User.email, set: { clerk_id: userId } }),
                tx.insert(Log).values({ email, action: 'user_created', message: logs['user_created']() }),
            ]);
        });

        await client.users.updateUserMetadata(userId, {
            publicMetadata: { role: 'user', registered: true },
            privateMetadata: { registered: true },
        });
    }

    return (
        <>{ children }</>
    );
}
