import storage from '../firebase.js';
import { ref, deleteObject, listAll } from 'firebase/storage';

export async function deleteVideo(folder, includeVideo = false) {
    if (folder) {
        const audioRef = ref(storage, folder + '/Audio/');
        const imageRef = ref(storage, folder + '/Image/');
        const videoRef = ref(storage, folder + '.mp4');

        try {
            await Promise.all([
                clearFolder(audioRef),
                clearFolder(imageRef),
                includeVideo && deleteObject(videoRef),
            ]);
        } catch (error) {
            console.error('Failed to delete folder:', error);
        }
    }
}

async function clearFolder(folderRef) {
    const { items } = await listAll(folderRef);
    await Promise.all(items.map(fileRef => deleteObject(fileRef)));
}