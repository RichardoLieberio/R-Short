import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { getDuration } from './actions';
import { usePlayerReturn } from './types';
import { VideoType } from '../../types';

export function usePlayer(video: VideoType | undefined, small: boolean): usePlayerReturn {
    const getHeight: () => number = useCallback(() => {
        const innerWidth: number = window.innerWidth - (small ? 50 : 50);
        const innerHeight: number = window.innerHeight - (small ? 200 : 150);
        return innerHeight * 2 / 3 > innerWidth ? Math.round(innerWidth * 3 / 2) : Math.round(innerHeight);
    }, [ small ]);

    const [ height, setHeight ]: [ number, Dispatch<SetStateAction<number>> ] = useState(getHeight());
    const [ durationInFrames, setDurationInFrames ]: [ number, Dispatch<SetStateAction<number>> ] = useState(0);
    const [ error, setError ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    useEffect(() => {
        async function fetchDuration(): Promise<void> {
            if (video) {
                if (video.status === 'generated') {
                    const duration: number | void = await getDuration(video.path!);
                    if (duration) setDurationInFrames(duration);
                    else setError(true);
                } else if (video.status === 'created') {
                    const duration: number = video.captions!.reduce((duration, captions) => duration + Math.ceil((captions.at(-1)!.end / 1000) * 30 + 15), 0);
                    setDurationInFrames(duration);
                }
            }
        }

        fetchDuration();
    }, [ video ]);

    useEffect(() => {
        function handleResize(): void {
            setHeight(getHeight());
        }

        window.addEventListener('resize', handleResize);

        return (): void => {
            window.removeEventListener('resize', handleResize);
        };
    }, [ getHeight ]);

    return { height, durationInFrames, error };
}
