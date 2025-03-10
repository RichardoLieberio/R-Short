'use server';

import { eq } from 'drizzle-orm';
import { db, Video } from '@database';
import { auth } from '@clerk/nextjs/server';

export async function fetchVideo(path: string): Promise<Blob> {
    const response: Response = await fetch(path);
    return await response.blob();
}

export async function renderVideo(videoId: number): Promise<string | void> {
    const { userId }: { userId: string | null } = await auth();

    const response: Response = await fetch(process.env.NEXT_PUBLIC_SERVICE_URI!, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, videoId }),
    });

    if (response.ok) {
        const { path }: { path: string } = await response.json();
        return path;
    }
}

export async function deleteVideo(id: number): Promise<void> {
    const [ { path, folder } ]: { path: string | null, folder: string | null }[] = await db.delete(Video)
        .where(eq(Video.id, id))
        .returning({ path: Video.path, folder: Video.folder });

    fetch(process.env.NEXT_PUBLIC_SERVICE_URI!, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, folder }),
    });
}
