'use server';

import { and, eq } from 'drizzle-orm';
import { db, User, Video } from '@database';

export async function backgroundRender(userId: string): Promise<void> {
    const videos: { videoId: number }[] = await db.select({ videoId: Video.id })
        .from(Video)
        .innerJoin(User, eq(User.id, Video.user_id))
        .where(and(eq(Video.status, 'created'), eq(User.clerk_id, userId)));

    videos.forEach(({ videoId }: { videoId: number }) => {
        fetch(process.env.NEXT_PUBLIC_SERVICE_URI!, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, videoId }),
        });
    });
}
