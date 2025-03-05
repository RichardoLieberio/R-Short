import { useState, Dispatch, SetStateAction } from 'react';

import { useAppSelector, useAppDispatch, AppDispatch } from '@store';
import { reduceCoin, addProcess, removeProcess } from '@store/user';

import { fetchVideo, deleteVideo } from './actions';

import { useVideoActionsReturn } from './types';
import { VideoType } from '../../types';

export function useVideoActions(video: VideoType | undefined): useVideoActionsReturn {
    const [ status, setStatus ]: [ string, Dispatch<SetStateAction<string>> ] = useState('');

    const processing: { [ id: number ]: string } = useAppSelector((state) => state.user.processing);
    const dispatch: AppDispatch = useAppDispatch();

    async function regenerateVideo(): Promise<void> {
        if (video && !processing[video.id] && !status) {
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
        if (video && video.path && !processing[video.id]) {
            dispatch(addProcess({ id: video.id, type: 'download' }));

            const blob: Blob = await fetchVideo(video.path);
            const url: string = window.URL.createObjectURL(blob);

            const anchor: HTMLAnchorElement = document.createElement('a');
            anchor.href = url;
            anchor.download = `video-${video.id}.mp4`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            window.URL.revokeObjectURL(url);
            dispatch(removeProcess(video.id));
        }
    }

    async function removeVideo(): Promise<void> {
        if (video && !processing[video.id]) {
            dispatch(addProcess({ id: video.id, type: 'delete' }));

            await deleteVideo(video.id);
            setTimeout(() => {
                history.replaceState(null, '', `/video`);
                location.reload();
            }, 1);

            dispatch(removeProcess(video.id));
        }
    }

    return { status, setStatus, regenerateVideo, downloadVideo, removeVideo };
}
