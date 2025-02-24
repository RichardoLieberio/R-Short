'use server';

import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { db, User } from '@database';
import { eq } from 'drizzle-orm';

export async function getUserCoin(): Promise<number> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    return await db.select({ coin: User.coin })
        .from(User)
        .where(eq(User.clerk_id, userId!))
        .limit(1)
        .then((res) => res[0].coin);
}
