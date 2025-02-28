import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useVideoReturn } from './types';
import { VideoType } from '../../types';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useAppDispatch, AppDispatch, useAppSelector } from '@store';
import { deleteVideo, getVideo } from './action';
import { addDelete, removeDelete } from '@/store/user';

export function useVideo(id: number): useVideoReturn {
    const [ video, setVideo ]: [ VideoType | null, Dispatch<SetStateAction<VideoType | null>> ] = useState<VideoType | null>(null);
    const [ videoNotFound, setVideoNotFound ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);
    const [ height, setHeight ]: [ number, Dispatch<SetStateAction<number>> ] = useState(getHeight());

    const router: AppRouterInstance = useRouter();
    const deleting: number[] = useAppSelector((state) => state.user.deleting);
    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        function handleResize(): void {
            setHeight(getHeight());
        }

        window.addEventListener('resize', handleResize);

        return (): void => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        async function fetchVideo(): Promise<void> {
            const fetchedVideo: VideoType | undefined = await getVideo(id);
            if (fetchedVideo) setVideo(fetchedVideo);
            else setVideoNotFound(true);
        }

        fetchVideo();
    }, [ id ]);

    function getHeight(): number {
        const innerWidth: number = window.innerWidth - 50;
        const innerHeight: number = window.innerHeight - 150;
        return innerHeight * 2 / 3 > innerWidth ? Math.round(innerWidth * 3 / 2) : Math.round(innerHeight);
    }

    async function removeVideo(): Promise<void> {
        if (!deleting.includes(id)) {
            dispatch(addDelete(id));
            const deletedId: number | void = await deleteVideo(id);
            if (deletedId) {
                router.back();
                setTimeout(() => window.location.reload(), 1);
            }
            dispatch(removeDelete(id));
        }
    }

    return { video, videoNotFound, height, removeVideo, deleting: deleting.includes(id) };
}

export function usePlayer(video: VideoType | null): { loading: boolean } {
    const [ loading, setLoading ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    useEffect(() => {
        async function preloadVideo(): Promise<void> {
            try {
                const images: Promise<unknown>[] = video!.imageUris.map((src) => new Promise((resolve, reject) => {
                    const image: HTMLImageElement = new Image();
                    image.src = src;
                    image.onload = (): void => resolve(undefined);
                    image.onerror = (): void => reject();
                }));

                const audios: Promise<unknown>[] = video!.audioUris.map((src) => new Promise((resolve, reject) => {
                    const audio: HTMLAudioElement = new Audio();
                    audio.src = src;
                    audio.oncanplaythrough = (): void => resolve(undefined);
                    audio.onerror = (): void => reject();
                }));

                await Promise.all([ ...images, ...audios ]);
                setLoading(true);
            } catch (error) {
                console.error(`Failed to load video: ${error}`);
            }
        }

        if (video) {
            setLoading(false);
            preloadVideo();
        }
    }, [ video ]);

    return { loading };
}
