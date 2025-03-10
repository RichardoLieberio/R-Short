import storage from '../firebase.js';
import { deleteObject, listAll } from 'firebase/storage';

export async function deleteVideo(req, res) {
    const folder = req.body.folder;

    if (folder) {
        const audioRef = ref(storage, folder + '/Audio/');
        const imageRef = ref(storage, folder + '/Image/');
        const videoRef = ref(storage, folder + '/video.mp4');

        try {
            await Promise.all([
                clearFolder(audioRef),
                clearFolder(imageRef),
                deleteObject(videoRef),
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