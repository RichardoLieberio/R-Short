'use server';

import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { VideoType } from './types';
import { db, User, Video } from '@database';
import { eq, desc } from 'drizzle-orm';
import { storage } from '@lib/firebase';
import { StorageReference, ref, ListResult, list, deleteObject } from 'firebase/storage';

export async function getVideos(count: number, page: number): Promise<VideoType[]> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    const maxPage: number = Math.max(1, Math.ceil(count ?? 0 / 5));
    const currentPage: number = Math.min(Math.max(1, page), maxPage);
    const offset: number = (currentPage - 1) * 5;

    return (await db
        .select({ id: Video.id, style: Video.style, duration: Video.duration, storyboard: Video.storyboard, audio_uri: Video.audio_uri, image_uri: Video.image_uri, captions: Video.captions, created_at: Video.created_at })
        .from(Video)
        .innerJoin(User, eq(User.id, Video.user_id))
        .where(eq(User.clerk_id, userId!))
        .orderBy(desc(Video.created_at))
        .limit(5)
        .offset(offset))
        .map((video) => ({
            id: video.id,
            style: video.style,
            duration: video.duration,
            storyboard: video.storyboard,
            audio_uri: video.audio_uri as string[],
            image_uri: video.image_uri as string[],
            captions: video.captions as { text: string; start: number; end: number, confidence: number, speaker: unknown }[][],
            created_at: video.created_at,
        }));
}

export async function deleteVideo(id: number): Promise<void | number> {
    const [ { deletedId, folder } ]: { deletedId: number, folder: string }[] = await db.delete(Video).where(eq(Video.id, id)).returning({ deletedId: Video.id, folder: Video.folder });

    try {
        const audioRef: StorageReference = ref(storage, `${folder}/Audio`);
        const imageRef: StorageReference = ref(storage, `${folder}/Image`);
        const [ audioList, imageList ]: [ ListResult, ListResult ] = await Promise.all([ list(audioRef), list(imageRef) ]);
        await Promise.all([
            ...audioList.items.map((itemRef) => deleteObject(itemRef)),
            ...imageList.items.map((itemRef) => deleteObject(itemRef)),
        ]);
    } catch (error) {
        console.error(`Failed to delete firebase folder "${folder}":`, error);
    }

    if (deletedId) return deletedId;
}
