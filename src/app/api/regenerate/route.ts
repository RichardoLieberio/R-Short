import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { eq, and } from 'drizzle-orm';
import { db, User, Video } from '@database';

import { userType, videoType } from './types';

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
            const { videoId }: { videoId: number } = await req.json();
            const video: videoType | undefined = await db.update(Video)
                .set({ status: 'pending' })
                .from(User)
                .where(and(eq(Video.id, videoId), eq(User.clerk_id, userId)))
                .returning({ style: Video.style, duration: Video.duration, storyboard: Video.storyboard })
                .then((videos) => videos[0]);

            if (!video) return NextResponse.json({ message: 'Video not found' }, { status: 404 });

            fetch(process.env.SERVICE_URI!, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, insertedId: videoId, ...video }),
            });

            return NextResponse.json({ message: 'Success', id: videoId }, { status: 200 });
        }

        return NextResponse.json({ message: "You don't have any coins" }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: (error as Error).message ?? 'Something went wrong' }, { status: 400 });
    }
}
