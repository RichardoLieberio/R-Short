'use client';

import { VideosType, VideoContainerProps } from '../../types';
import { JSX, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@components/SocketProvider';
import VideoCard from '../VideoCard';

export default function VideoContainer({ videos, lastVideo }: VideoContainerProps): JSX.Element {
    const [ renderVideos, setRenderVideos ]: [ VideosType[], Dispatch<SetStateAction<VideosType[]>> ] = useState(videos);
    const { socket }: { socket: Socket | null } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('generate:success', ({ videoId, image_uri }: { videoId: number, image_uri: string }) => {
                if (renderVideos.find((video) => video.id === videoId)) {
                    const imageUri: string = JSON.parse(image_uri)[0];
                    const newVideos: VideosType[] = renderVideos.map((video) => {
                        if (video.id === videoId) return { id: video.id, status: 'created', imageUri };
                        return video;
                    });
                    setRenderVideos(newVideos);
                }
            });

            socket.on('generate:failed', ({ videoId }: { videoId: number }) => {
                if (renderVideos.find((video) => video.id === videoId)) {
                    const newVideos: VideosType[] = renderVideos.map((video) => {
                        if (video.id === videoId) return { ...video, status: 'failed' };
                        return video;
                    });
                    setRenderVideos(newVideos);
                }
            });
        }
    }, [ renderVideos, socket ]);

    return (
        <>
            {
                renderVideos.map((video) => <VideoCard key={video.id} video={video} lastVideo={lastVideo} />)
            }
        </>
    );
}
