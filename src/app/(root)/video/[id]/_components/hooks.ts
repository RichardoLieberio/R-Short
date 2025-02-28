import { useAppDispatch, AppDispatch, useAppSelector } from '@store';
import { deleteVideo } from '../../action';
import { addProcess, removeProcess } from '@store/user';

export function useActionButton(id: number | undefined): { processing: boolean, removeVideo: () => void } {
    const processing: number[] = useAppSelector((state) => state.user.processing);
    const dispatch: AppDispatch = useAppDispatch();

    async function removeVideo(): Promise<void> {
        if (id) {
            if (!processing.includes(id)) {
                dispatch(addProcess(id));

                const deletedId: number | void = await deleteVideo(id);
                if (deletedId) {
                    setTimeout(() => {
                        history.replaceState(null, '', `/video`);
                        location.reload();
                    }, 1);
                }

                dispatch(removeProcess(id));
            }
        }
    }

    return { processing: id ? processing.includes(id) : false, removeVideo };
}
