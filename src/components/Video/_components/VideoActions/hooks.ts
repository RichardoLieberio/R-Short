import { useState, Dispatch, SetStateAction } from 'react';

import { useAppSelector, useAppDispatch, AppDispatch } from '@store';
import { reduceCoin, addProcess, removeProcess } from '@store/user';

import { useVideoActionsReturn } from './types';
import { VideoType } from '../../types';

export function useVideoActions(video: VideoType | undefined): useVideoActionsReturn {
    const [ status, setStatus ]: [ string, Dispatch<SetStateAction<string>> ] = useState('');

    const processing: number[] = useAppSelector((state) => state.user.processing);
    const dispatch: AppDispatch = useAppDispatch();

    async function regenerateVideo(): Promise<void> {
        if (video && !processing.includes(video.id) && !status) {
            try {
                setStatus('loading');
                const response: Response = await fetch('/api/regenerate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoId: video.id }),
                });

                if (response.status === 200) {
                    dispatch(reduceCoin());
                    setStatus('done');
                } else if (response.status === 400 || response.status === 404) {
                    const { message }: { message: string } = await response.json();
                    setStatus(message);
                }
            } catch (error) {
                console.error(error);
                setStatus('Something went wrong');
            }
        }
    }

    async function downloadVideo(): Promise<void> {
        if (video && !processing.includes(video.id)) {
            dispatch(addProcess(video.id));

            console.log('Download video');

            // const videoBlob: Blob | void = await renderVideo(video.id);
            // if (videoBlob) {
            //     const url: string = URL.createObjectURL(videoBlob);
            //     const a: HTMLAnchorElement = document.createElement('a');

            //     a.href = url;
            //     a.download = `video-${video.id}.mp4`;
            //     document.body.appendChild(a);

            //     a.click();
            //     a.remove();

            //     URL.revokeObjectURL(url);
            // }

            dispatch(removeProcess(video.id));
        }
    }

    async function removeVideo(): Promise<void> {
        if (video && !processing.includes(video.id)) {
            dispatch(addProcess(video.id));

            console.log('Delete video');

            // const deletedId: number | void = await deleteVideo(video.id);
            // if (deletedId) {
            //     setTimeout(() => {
            //         history.replaceState(null, '', `/video`);
            //         location.reload();
            //     }, 1);
            // }

            dispatch(removeProcess(video.id));
        }
    }

    return { status, setStatus, regenerateVideo, downloadVideo, removeVideo };
}
