'use server';

import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import { db, User, Video } from '@database';
import { VideoType } from './types';

export async function getVideo(id: number): Promise<VideoType | undefined> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    return await db.select({ id: Video.id, status: Video.status, style: Video.style, duration: Video.duration, storyboard: Video.storyboard, path: Video.path, createdAt: Video.created_at })
        .from(Video)
        .innerJoin(User, eq(User.id, Video.user_id))
        .where(and(eq(Video.id, id), eq(User.clerk_id, userId!)))
        .then((result) => result[0]);
}
