'use server';

import { ClerkClient } from '@clerk/backend';
import { auth, clerkClient, ClerkMiddlewareAuthObject } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { db, User } from '@database';
import { userType, updateRoleReturn } from './types';

export async function fetchUsers(): Promise<userType[]> {
    const users: userType[] = await db.select({ clerkId: User.clerk_id, email: User.email, role: User.role, coin: User.coin, createdAt: User.created_at }).from(User);
    return users;
}

export async function updateRole(clerkId: string, role: string): Promise<updateRoleReturn> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    if (userId !== clerkId) {
        const { updatedClerkId, newRole }: { updatedClerkId: string | undefined, newRole: 'admin' | 'user' | undefined }  = await db.update(User)
            .set({ role: role === 'admin' ? 'admin' : 'user' })
            .where(and(eq(User.clerk_id, clerkId)))
            .returning({ updatedClerkId: User.clerk_id, newRole: User.role })
            .then((result) => result[0] || {});

        if (updatedClerkId && newRole) {
            const client: ClerkClient = await clerkClient();

            await client.users.updateUserMetadata(updatedClerkId, {
                publicMetadata: { role: newRole },
            });

            return { updatedClerkId, newRole };
        }
    }
}
