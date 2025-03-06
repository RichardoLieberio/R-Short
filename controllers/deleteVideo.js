import firebaseConfig from '../firebase.config.js';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export async function deleteVideo(req, res) {
    const path = req.body.path?.split('/o/')[1]?.split('?')[0];

    if (path) {
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
    }
}
