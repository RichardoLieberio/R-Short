import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useVideoReturn } from './types';
import { VideoType } from '../../types';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useAppDispatch, AppDispatch, useAppSelector } from '@store';
import { deleteVideo, getVideo } from '../../action';
import { addDelete, removeDelete } from '@store/user';

export function useVideo(id: number): useVideoReturn {
    const [ video, setVideo ]: [ VideoType | null, Dispatch<SetStateAction<VideoType | null>> ] = useState<VideoType | null>(null);
    const [ videoNotFound, setVideoNotFound ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    const router: AppRouterInstance = useRouter();
    const deleting: number[] = useAppSelector((state) => state.user.deleting);
    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        async function fetchVideo(): Promise<void> {
            const fetchedVideo: VideoType | undefined = await getVideo(id);
            if (fetchedVideo) setVideo(fetchedVideo);
            else setVideoNotFound(true);
        }

        fetchVideo();
    }, [ id ]);

    async function removeVideo(): Promise<void> {
        if (!deleting.includes(id)) {
            dispatch(addDelete(id));

            const deletedId: number | void = await deleteVideo(id);
            if (deletedId) {
                const params: URLSearchParams = new URL(document.location.toString()).searchParams;
                const last: string | null = params.get('last');

                router.back();
                setTimeout(() => {
                    const params: URLSearchParams = new URL(document.location.toString()).searchParams;
                    const page: string | null = params.get('page');

                    if (page && page !== '1' && last) history.replaceState(null, '', `?page=${+page - 1}`);
                    location.reload();
                }, 1);
            }

            dispatch(removeDelete(id));
        }
    }

    return { video, videoNotFound, removeVideo, deleting: deleting.includes(id) };
}
