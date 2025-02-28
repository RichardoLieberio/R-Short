'use server';

import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { VideoType, UnknownVideoType, Caption } from './types';
import { db, User, Video } from '@database';
import { and, eq } from 'drizzle-orm';
import { storage } from '@lib/firebase';
import { StorageReference, ref, ListResult, list, deleteObject } from 'firebase/storage';

export async function getVideo(id: number): Promise<VideoType | undefined> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    return await db.select({ id: Video.id, style: Video.style, duration: Video.duration, storyboard: Video.storyboard, audioUris: Video.audio_uri, imageUris: Video.image_uri, captions: Video.captions, createdAt: Video.created_at })
        .from(Video)
        .innerJoin(User, eq(User.id, Video.user_id))
        .where(and(eq(Video.id, id), eq(User.clerk_id, userId!)))
        .then(([ result ]: UnknownVideoType[]) => {
            if (!result) return undefined;
            return {
                ...result,
                audioUris: result.audioUris as string[],
                imageUris: result.imageUris as string[],
                captions: result.captions as Caption[][],
            };
        });
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
