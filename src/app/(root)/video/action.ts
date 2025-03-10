'use server';

import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { eq, desc, sql } from 'drizzle-orm';
import { db, User, Video } from '@database';
import { getVideosReturn, videoPreviewType } from './types';

export async function getVideos(offset: number): Promise<getVideosReturn> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    const [ videos, total ]: [ videoPreviewType[], number ] = await Promise.all([
        db.select({ id: Video.id, status: Video.status, path: Video.path, imageUri: Video.image_uri })
            .from(Video)
            .innerJoin(User, eq(User.id, Video.user_id))
            .where(eq(User.clerk_id, userId!))
            .orderBy(desc(Video.created_at))
            .limit(5)
            .offset(offset)
            .then((result) => result.map((video) => ({ ...video, imageUri: video.status === 'created' ? (video.imageUri as string[])[0] as string : null }))),
        db.select({ total: sql<number>`COUNT(*)` })
            .from(Video)
            .innerJoin(User, eq(User.id, Video.user_id))
            .where(eq(User.clerk_id, userId!))
            .then(([ result ]: { total: number }[]) => result.total ?? 0),
    ]);

    return { videos, total };
}
