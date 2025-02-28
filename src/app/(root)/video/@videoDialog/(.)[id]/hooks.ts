import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useVideoReturn } from './types';
import { VideoType } from '../../types';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useAppDispatch, AppDispatch, useAppSelector } from '@store';
import { deleteVideo, getVideo } from '../../action';
import { addProcess, removeProcess } from '@store/user';

export function useVideo(id: number): useVideoReturn {
    const [ video, setVideo ]: [ VideoType | null, Dispatch<SetStateAction<VideoType | null>> ] = useState<VideoType | null>(null);
    const [ videoNotFound, setVideoNotFound ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    const router: AppRouterInstance = useRouter();
    const processing: number[] = useAppSelector((state) => state.user.processing);
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
        if (!processing.includes(id)) {
            dispatch(addProcess(id));

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

            dispatch(removeProcess(id));
        }
    }

    return { video, videoNotFound, removeVideo, processing: processing.includes(id) };
}
