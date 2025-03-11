'use server';

import { eq } from 'drizzle-orm';
import { db, Video } from '@database';

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
