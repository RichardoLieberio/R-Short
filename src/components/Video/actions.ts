'use server';

import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import { db, User, Video } from '@database';
import { TranscriptWord } from 'assemblyai';
import { VideoType } from './types';

export async function getVideo(id: number): Promise<VideoType | undefined> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    return await db.select({ id: Video.id, status: Video.status, style: Video.style, duration: Video.duration, storyboard: Video.storyboard, path: Video.path, folder: Video.folder, audioUris: Video.audio_uri, imageUris: Video.image_uri, captions: Video.captions, createdAt: Video.created_at })
        .from(Video)
        .innerJoin(User, eq(User.id, Video.user_id))
        .where(and(eq(Video.id, id), eq(User.clerk_id, userId!)))
        .then((result) => {
            if (result) return ({
                ...result[0],
                audioUris: result[0].audioUris ? result[0].audioUris as string[] : null,
                imageUris: result[0].imageUris ? result[0].imageUris as string[] : null,
                captions: result[0].captions ? result[0].captions as TranscriptWord[][] : null,
            });
        });
}
