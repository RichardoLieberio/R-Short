import path from 'path';
import fs from 'fs';
import storage from '../firebase.js';

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { eq, and } from 'drizzle-orm';
import { db, User, Video } from '../database/index.js';

export async function render(userId, videoId) {
    try {
        const video = await db.select({ audioUris: Video.audio_uri, imageUris: Video.image_uri, captions: Video.captions})
            .from(Video)
            .innerJoin(User, eq(User.id, Video.user_id))
            .where(and(eq(Video.id, videoId), eq(User.clerk_id, userId)))
            .then((result) => ({
                audioUris: JSON.parse(result[0].audioUris),
                imageUris: JSON.parse(result[0].imageUris),
                captions: JSON.parse(result[0].captions),
            }));

        const bundleLocation = await bundle({ entryPoint: path.resolve('./remotion/index.js') });
        const durations = video.captions.map((captions) => Math.ceil((captions.at(-1).end / 1000) * 30 + 15));
        const inputProps = { video, durations };
        const composition = await selectComposition({ serveUrl: bundleLocation, id: 'composition', inputProps });

        const videoPath = path.join(process.cwd(), 'temp', videoId + '.mp4');

        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: 'h264',
            outputLocation: videoPath,
            inputProps,
            acknowledgeRemotionLicense: true,
        });

        if (fs.existsSync(videoPath)) {
            const storageRef = ref(storage, videoId + '.mp4');

            const videoBuffer = fs.readFileSync(videoPath);
            const metadata = { contentType: 'video/mp4' };
            await uploadBytes(storageRef, videoBuffer, metadata);

            const path = await getDownloadURL(storageRef);

            await db.update(Video).set({ status: 'generated', path, folder: null, audio_uri: null, image_uri: null, captions: null }).where(eq(Video.id, videoId));
            fs.unlinkSync(videoPath);

            return path;
        } else {
            throw new Error('Failed to generate video');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}
