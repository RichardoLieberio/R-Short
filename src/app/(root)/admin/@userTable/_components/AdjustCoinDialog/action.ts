'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, User } from '@database';
import coinSchema from '@schema/coinSchema';
import { updateCoinReturn } from './types';

export async function updateCoin(clerkId: string, coin: number): Promise<updateCoinReturn | void> {
    try {
        const { coin: parsedCoin }: { coin: number } = coinSchema.parse({ coin });
        const { updatedClerkId, newCoin }: { updatedClerkId: string | undefined, newCoin: number | undefined } = await db.update(User)
            .set({ coin: parsedCoin })
            .where(eq(User.clerk_id, clerkId))
            .returning({ updatedClerkId: User.clerk_id, newCoin: User.coin })
            .then((result) => result[0] || {});

        if (updatedClerkId) {
            fetch(process.env.NEXT_PUBLIC_SERVICE_URI! + '/coin', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clerkId: updatedClerkId, coin: newCoin }),
            });

            return { clerkId: updatedClerkId, coin: newCoin! };
        }
    } catch (error) {
        if (error instanceof z.ZodError) return { errors: error.flatten().fieldErrors };
    }
}
