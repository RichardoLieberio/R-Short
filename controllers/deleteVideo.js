import storage from '../firebase.js';
import { ref, deleteObject, listAll } from 'firebase/storage';

export async function deleteVideo(path, folder) {
    try {
        const tasks = [];

        if (path) {
            const videoRef = ref(storage, decodeURIComponent(path.split('/o/')[1]?.split('?')[0]));
            tasks.push(deleteObject(videoRef));
        }

        if (folder) {
            const audioRef = ref(storage, folder + '/Audio/');
            const imageRef = ref(storage, folder + '/Image/');

            tasks.push(clearFolder(audioRef));
            tasks.push(clearFolder(imageRef));
        }

        await Promise.all(tasks);
    } catch (error) {
        console.error('Failed to delete folder:', error);
    }
}

async function clearFolder(folderRef) {
    const { items } = await listAll(folderRef);
    await Promise.all(items.map(fileRef => deleteObject(fileRef)));
}