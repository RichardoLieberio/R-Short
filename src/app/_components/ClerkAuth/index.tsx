import { ReactNode, JSX } from 'react';
import { auth, clerkClient, User as ClerkUser } from '@clerk/nextjs/server';
import { ClerkClient } from '@clerk/backend';
import { db, User, Log, logs } from '@database';

export default async function ClerkAuth({ children }: { children: ReactNode }): Promise<JSX.Element> {
    const { userId }: { userId: string | null } = await auth();

    if (userId) {
        const client: ClerkClient = await clerkClient();
        const user: ClerkUser = await client.users.getUser(userId);

        if (!user.privateMetadata.registered) {
            const email: string = user.emailAddresses[0].emailAddress;

            await db.transaction(async (tx) => {
                await Promise.all([
                    tx.insert(User)
                        .values({ clerk_id: userId, email })
                        .onConflictDoUpdate({ target: User.email, set: { clerk_id: userId, is_deleted: false, deleted_at: null } }),
                    tx.insert(Log).values({ email, action: 'user_created', message: logs['user_created']() }),
                ]);
            });

            await client.users.updateUserMetadata(userId, {
                privateMetadata: { registered: true },
            });
        }
    }

    return (
        <>{ children }</>
    );
}
