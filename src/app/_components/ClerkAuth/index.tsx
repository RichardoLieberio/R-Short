import { ReactNode, JSX } from 'react';
import { ClerkMiddlewareAuthObject, auth, clerkClient, User as ClerkUser } from '@clerk/nextjs/server';
import { ClerkClient } from '@clerk/backend';
import { db, User, Log, logs } from '@database';
import { QueryResult } from '@neondatabase/serverless';

export default async function ClerkAuth({ children }: { children: ReactNode }): Promise<JSX.Element> {
    const { userId, sessionClaims }: ClerkMiddlewareAuthObject = await auth();

    type SessionClaims = { metadata?: { registered?: boolean } };
    const claims: SessionClaims = sessionClaims as SessionClaims;

    if (userId && !claims.metadata?.registered) {
        const client: ClerkClient = await clerkClient();
        const user: ClerkUser = await client.users.getUser(userId);
        const email: string = user.emailAddresses[0].emailAddress;

        const role: string = await db.transaction(async (tx) => {
            const [ [ result ] ]: [ { role: 'user' | 'admin' }[], QueryResult<never> ] = await Promise.all([
                tx.insert(User)
                    .values({ clerk_id: userId, email })
                    .onConflictDoUpdate({ target: User.email, set: { clerk_id: userId } })
                    .returning({ role: User.role }),
                tx.insert(Log).values({ email, action: 'user_created', message: logs['user_created']() }),
            ]);

            return result.role;
        });

        await client.users.updateUserMetadata(userId, {
            publicMetadata: { role, registered: true },
        });
    }

    return (
        <>{ children }</>
    );
}
