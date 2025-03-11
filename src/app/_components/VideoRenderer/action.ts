'use server';

import { and, or, eq } from 'drizzle-orm';
import { db, User, Video } from '@database';

export async function backgroundRender(userId: string): Promise<void> {
    type videoType = {
        videoId: number;
        status: 'pending' | 'generated' | 'created' | 'failed';
        style: string;
        duration: string;
        storyboard: string;
    };

    const videos: videoType[] = await db.select({ videoId: Video.id, status: Video.status, style: Video.style, duration: Video.duration, storyboard: Video.storyboard })
        .from(Video)
        .innerJoin(User, eq(User.id, Video.user_id))
        .where(and(or(eq(Video.status, 'created'), eq(Video.status, 'pending')), eq(User.clerk_id, userId)));

    videos.forEach(({ videoId, status, style, duration, storyboard }: videoType) => {
        if (status === 'created') fetch(process.env.NEXT_PUBLIC_SERVICE_URI!, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, videoId }),
        });

        if (status === 'pending') fetch(process.env.NEXT_PUBLIC_SERVICE_URI!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, insertedId: videoId, style, duration, storyboard }),
        });
    });
}
