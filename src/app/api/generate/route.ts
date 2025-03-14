import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { z } from 'zod';
import formSchema from '@schema/formSchema';

import { eq, and, sql } from 'drizzle-orm';
import { db, User, Video } from '@database';

import { userType, bodyType, parsedBodyType, transactionReturn } from './types';

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId }: { userId: string | null } = await auth();
        if (!userId) return NextResponse.json({ message: 'You are not authenticated' }, { status: 400 });

        const user: userType | undefined = await db.select({ id: User.id, role: User.role, coin: User.coin })
            .from(User)
            .where(eq(User.clerk_id, userId))
            .limit(1)
            .then((res) => res[0]);
        if (!user) return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });

        if (user.role === 'admin' || user.coin > 0) {
            const body: bodyType = await req.json();
            const { style, duration, storyboard }: parsedBodyType = formSchema.parse(body);

            const insertedId: number = await db.transaction(async (tx) => {
                const [ [ { insertedId } ] ]: transactionReturn = await Promise.all([
                    tx.insert(Video)
                        .values({ user_id: user.id, style, duration, storyboard })
                        .returning({ insertedId: Video.id }),
                    tx.update(User)
                        .set({ coin: sql`${User.coin} - 1` })
                        .where(and(eq(User.id, user.id), eq(User.role, 'user'))),
                ]);

                return insertedId;
            });

            await fetch(process.env.NEXT_PUBLIC_SERVICE_URI!, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, insertedId, style, duration, storyboard }),
            });

            return NextResponse.json({ message: 'Success', id: insertedId }, { status: 200 });
        }

        return NextResponse.json({ message: "You don't have any coins" }, { status: 403 });
    } catch (error) {
        if (error instanceof z.ZodError) return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 429 });
        console.error(error);
        return NextResponse.json({ message: (error as Error).message ?? 'Something went wrong' }, { status: 400 });
    }
}
