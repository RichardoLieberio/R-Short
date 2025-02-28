import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { VideoType } from './types';

export function usePlayer(video: VideoType | null): { height: number, loading: boolean } {
    const [ height, setHeight ]: [ number, Dispatch<SetStateAction<number>> ] = useState(getHeight());
    const [ loading, setLoading ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

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

    function getHeight(): number {
        const innerWidth: number = window.innerWidth - 50;
        const innerHeight: number = window.innerHeight - 150;
        return innerHeight * 2 / 3 > innerWidth ? Math.round(innerWidth * 3 / 2) : Math.round(innerHeight);
    }

    return { height, loading };
}
