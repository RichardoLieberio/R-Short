import { NextResponse } from 'next/server';
import { eq, and, sql } from 'drizzle-orm';

import { Socket } from 'socket.io-client';
import { getSocket } from '@lib/socket';

import { auth } from '@clerk/nextjs/server';

import { z } from 'zod';
import formSchema from '@schema/formSchema';

import { db, User, Video } from '@database';
import { QueryResult } from '@neondatabase/serverless';

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId }: { userId: string | null } = await auth();
        if (!userId) return NextResponse.json({ message: 'You are not authenticated' }, { status: 400 });

        const socket: Socket | null = getSocket(userId);
        if (!socket) return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });

        const user: { id: number, role: 'user' | 'admin', email: string, coin: number } | undefined = await db.select({ id: User.id, role: User.role, email: User.email, coin: User.coin })
            .from(User)
            .where(eq(User.clerk_id, userId))
            .limit(1)
            .then((res) => res[0]);
        if (!user) return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });

        if (user.role === 'admin' || user.coin > 0) {
            const body: { style: unknown, duration: unknown, storyboard: unknown } = await req.json();
            const { style, duration, storyboard }: { style: string, duration: '15' | '30' | '60', storyboard: string } = formSchema.parse(body);

            const insertedId: number = await db.transaction(async (tx) => {
                const [ [ { insertedId } ] ]: [ { insertedId: number }[], QueryResult<never> ] = await Promise.all([
                    tx.insert(Video)
                        .values({ user_id: user.id, style, duration, storyboard })
                        .returning({ insertedId: Video.id }),
                    tx.update(User)
                        .set({ coin: sql`${User.coin} - 1` })
                        .where(and(eq(User.id, user.id), eq(User.role, 'user'))),
                ]);

                return insertedId;
            });

            fetch('http://localhost:4000/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, insertedId, style, duration, storyboard }),
            });

            return NextResponse.json({ message: 'Success', id: insertedId }, { status: 200 });
        }

        return NextResponse.json({ message: "You don't have any coins" }, { status: 400 });
    } catch (error) {
        if (error instanceof z.ZodError) return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 429 });

        console.error(error);
        return NextResponse.json({ message: (error as Error).message ?? 'Something went wrong' }, { status: 400 });
    }
}
