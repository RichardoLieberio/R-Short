'use server';

import { parseMedia } from '@remotion/media-parser';

export async function getDuration(src: string): Promise<number | void> {
    try {
        const { slowDurationInSeconds }: { slowDurationInSeconds: number } = await parseMedia({ src, fields: { slowDurationInSeconds: true } });
        if (slowDurationInSeconds) return Math.round(slowDurationInSeconds * 30);
    } catch (error) {
        console.error(error);
    }
}
