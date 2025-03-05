import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from '@store';

import { useSocket } from '@components/SocketProvider';

import { getVideo } from './actions';
import { VideoType, useVideoReturn } from './types';

export function useVideo(id: number): useVideoReturn {
    const [ video, setVideo ]: [ VideoType | undefined | null, Dispatch<SetStateAction<VideoType | undefined | null>> ] = useState<VideoType | undefined | null>(undefined);
    const { socket }: { socket: Socket | null } = useSocket();

    const processing: { [ id: number ]: string } = useAppSelector((state) => state.user.processing);

    useEffect(() => {
        if (socket) {
            socket.on('generate:pending', ({ videoId }: { videoId: number }) => {
                if (video && video.id === videoId) setVideo({ ...video, status: 'pending' });
            });

            socket.on('generate:success', ({ videoId, path }: { videoId: number, path: string }) => {
                if (video && video.id === videoId) setVideo({ ...video, status: 'created', path });
            });

            socket.on('generate:failed', ({ videoId }: { videoId: number }) => {
                if (video && video.id === videoId) setVideo({ ...video, status: 'failed' });
            });
        }
    }, [ id, video, socket ]);

    useEffect(() => {
        async function fetchVideo(): Promise<void> {
            if (id) {
                const video: VideoType | undefined = await getVideo(id);
                setVideo(video ?? null);
            }
        }

        fetchVideo();
    }, [ id ]);

    return { video, processing: processing[id] };
}
