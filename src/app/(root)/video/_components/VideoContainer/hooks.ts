import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';

import { AppDispatch, useAppDispatch } from '@store';
import { incrementCoin } from '@store/user';

import { useSocket } from '@components/SocketProvider';

import { useVideoContainerReturn } from './types';
import { videoPreviewType } from '../../types';

export function useVideoContainer(videos: videoPreviewType[]): useVideoContainerReturn {
    const [ renderVideos, setRenderVideos ]: [ videoPreviewType[], Dispatch<SetStateAction<videoPreviewType[]>> ] = useState(videos);
    const { socket }: { socket: Socket | null } = useSocket();

    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        setRenderVideos(videos);
    }, [ videos ]);

    useEffect(() => {
        if (socket) {
            socket.on('generate:pending', ({ videoId }: { videoId: number }) => {
                if (renderVideos.find((video) => video.id === videoId)) {
                    const newVideos: videoPreviewType[] = renderVideos.map((video) => {
                        if (video.id === videoId) return { ...video, status: 'pending' };
                        return video;
                    });
                    setRenderVideos(newVideos);
                }
            });

            socket.on('generate:rendered', ({ videoId, path }: { videoId: number, path: string }) => {
                if (renderVideos.find((video) => video.id === videoId)) {
                    const newVideos: videoPreviewType[] = renderVideos.map((video) => {
                        if (video.id === videoId) return { id: video.id, status: 'generated', path, imageUri: null };
                        return video;
                    });
                    setRenderVideos(newVideos);
                }
            });

            socket.on('generate:success', ({ videoId, image_uri }: { videoId: number, image_uri: string }) => {
                if (renderVideos.find((video) => video.id === videoId)) {
                    const newVideos: videoPreviewType[] = renderVideos.map((video) => {
                        if (video.id === videoId) return { id: video.id, status: 'created', path: null, imageUri: JSON.parse(image_uri)[0] };
                        return video;
                    });
                    setRenderVideos(newVideos);
                }
            });

            socket.on('generate:failed', ({ videoId }: { videoId: number }) => {
                dispatch(incrementCoin());
                if (renderVideos.find((video) => video.id === videoId)) {
                    const newVideos: videoPreviewType[] = renderVideos.map((video) => {
                        if (video.id === videoId) return { ...video, status: 'failed' };
                        return video;
                    });
                    setRenderVideos(newVideos);
                }
            });
        }
    }, [ renderVideos, socket, dispatch ]);

    return { renderVideos };
}
