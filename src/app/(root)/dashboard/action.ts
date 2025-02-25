'use server';

import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { VideoType } from './types';
import { db, User, Video } from '@database';
import { eq, desc } from 'drizzle-orm';

export async function getVideos(count: number, page: number): Promise<VideoType[]> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    const maxPage: number = Math.max(1, Math.ceil(count ?? 0 / 5));
    const currentPage: number = Math.min(Math.max(1, page), maxPage);
    const offset: number = (currentPage - 1) * 5;

    return (await db
        .select({ id: Video.id, audio_uri: Video.audio_uri, image_uri: Video.image_uri, captions: Video.captions, created_at: Video.created_at })
        .from(Video)
        .innerJoin(User, eq(User.id, Video.user_id))
        .where(eq(User.clerk_id, userId!))
        .orderBy(desc(Video.created_at))
        .limit(5)
        .offset(offset))
        .map((video) => ({
            id: video.id,
            audio_uri: video.audio_uri as string[],
            image_uri: video.image_uri as string[],
            captions: video.captions as { text: string; start: number; end: number, confidence: number, speaker: unknown }[][],
            created_at: video.created_at,
        }));
}
