'use server';

import { eq } from 'drizzle-orm';
import { db, Video } from '@database';

export async function fetchVideo(path: string): Promise<Blob> {
    const response: Response = await fetch(path);
    return await response.blob();
}

export async function deleteVideo(id: number): Promise<void> {
    const [ { path } ]: { path: string | null }[] = await db.delete(Video)
        .where(eq(Video.id, id))
        .returning({ path: Video.path });

    fetch(process.env.SERVICE_URI!, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
    });
}
