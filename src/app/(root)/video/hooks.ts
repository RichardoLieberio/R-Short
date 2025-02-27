import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useVideoReturn, VideoType, useDialogReturn, usePlayerReturn } from './types';
import { getVideos, deleteVideo } from './action';
// import { renderMedia } from '@remotion/renderer';

export function useVideo(count: number): useVideoReturn {
    const [ total, setTotal ]: [ number, Dispatch<SetStateAction<number>> ] = useState(count);
    const [ videos, setVideos ]: [ VideoType[], Dispatch<SetStateAction<VideoType[]>> ] = useState<VideoType[]>([]);
    const [ page, setPage ]: [ number, Dispatch<SetStateAction<number>> ] = useState(1);
    const [ loading, setLoading ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);
    const [ deleting, setDeleting ]: [ number[], Dispatch<SetStateAction<number[]>> ] = useState<number[]>([]);

    useEffect(() => {
        async function fetchVideos(): Promise<void> {
            setLoading(true);
            const videos: VideoType[] = await getVideos(total, page);
            setVideos(videos);
            setLoading(false);
        }

        fetchVideos();
    }, [ total, page ]);

    function prevPage(): void {
        if (page > 1) setPage((page) => page - 1);
    }

    function nextPage(): void {
        if (page < Math.ceil(total / 5)) setPage((page) => page + 1);
    }

    function getPages(): number[] {
        const totalPages: number = Math.ceil(total / 5);

        if (totalPages <= 1) return [ 1 ];
        if (totalPages <= 2) return [ 1, 2 ];
        if (totalPages <= 3) return [ 1, 2, 3 ];

        if (page === 1) return [ 1, 2, 3 ];
        if (page === totalPages) return [ totalPages - 2, totalPages - 1, totalPages ];

        return [ page - 1, page, page + 1 ];
    }

    async function removeVideo(id: number): Promise<void> {
        if (!deleting.includes(id)) {
            setDeleting((deleting) => [ ...deleting, id ]);

            const deletedId: number | void = await deleteVideo(id);
            if (deletedId) {
                setVideos((videos) => videos.filter((video) => video.id !== deletedId));
                setTotal((total) => total - 1);
            }

            setDeleting((deleting) => deleting.filter((deletingId) => deletingId !== id));
        }
    }

    return { total, videos, loading, deleting, page, setPage, prevPage, nextPage, getPages, removeVideo };
}

export function useDialog(): useDialogReturn {
    const [ open, setOpen ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);
    const [ video, setVideo ]: [ VideoType | undefined, Dispatch<SetStateAction<VideoType | undefined>> ] = useState<VideoType | undefined>(undefined);

    function openDialog(video: VideoType): void {
        setOpen(true);
        setVideo(video);
    }

    return { open, setOpen, video, openDialog };
}

export function usePlayer(video: VideoType): usePlayerReturn {
    const [ loaded, setLoaded ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);
    const [ height, setHeight ]: [ number, Dispatch<SetStateAction<number>> ] = useState(getHeight());

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
        async function preloadVideo(): Promise<void> {
            try {
                const images: Promise<unknown>[] = video.image_uri.map((src) => new Promise((resolve, reject) => {
                    const image: HTMLImageElement = new Image();
                    image.src = src;
                    image.onload = (): void => resolve(undefined);
                    image.onerror = (): void => reject();
                }));

                const audios: Promise<unknown>[] = video.audio_uri.map((src) => new Promise((resolve, reject) => {
                    const audio: HTMLAudioElement = new Audio();
                    audio.src = src;
                    audio.oncanplaythrough = (): void => resolve(undefined);
                    audio.onerror = (): void => reject();
                }));

                await Promise.all([ ...images, ...audios ]);
                setLoaded(true);
            } catch (error) {
                console.error(`Failed to load video: ${error}`);
            }
        }

        if (video) preloadVideo();
    }, [ video ]);

    function getHeight(): number {
        const innerWidth: number = window.innerWidth - 50;
        const innerHeight: number = window.innerHeight - 150;
        return innerHeight * 2 / 3 > innerWidth ? Math.round(innerWidth * 3 / 2) : Math.round(innerHeight);
    }

    return { loaded, height };
}

export async function useDownloader(): Promise<void> {
    console.log('Hello world');
    // async function downloader(): Promise<void> {
    //     const uri = await renderMedia({
    //         composition: 'scene',
    //         serveUrl: window.location.origin,
    //         codec: 'h264',
    //         outputLocation: 'video.mp4',
    //         inputProps: {
    //             imageUri: video.image_uri[0],
    //             audioUri: video.audio_uri[0],
    //             captions: video.captions[0],
    //         },
    //     });
    // }
}
