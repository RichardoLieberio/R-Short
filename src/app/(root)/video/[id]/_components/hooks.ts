import { useAppDispatch, AppDispatch, useAppSelector } from '@store';
import { deleteVideo } from '../../action';
import { addDelete, removeDelete } from '@store/user';

export function useActionButton(id: number | undefined): { deleting: boolean, removeVideo: () => void } {
    const deleting: number[] = useAppSelector((state) => state.user.deleting);
    const dispatch: AppDispatch = useAppDispatch();

    async function removeVideo(): Promise<void> {
        if (id) {
            if (!deleting.includes(id)) {
                dispatch(addDelete(id));

                const deletedId: number | void = await deleteVideo(id);
                if (deletedId) {
                    setTimeout(() => {
                        history.replaceState(null, '', `/video`);
                        location.reload();
                    }, 1);
                }

                dispatch(removeDelete(id));
            }
        }
    }

    return { deleting: id ? deleting.includes(id) : false, removeVideo };
}
