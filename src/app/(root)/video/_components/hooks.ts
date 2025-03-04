import { VideosType, VideoType } from '../types';
import { useVideoReturn, useVideoActionsReturn } from './types';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@components/SocketProvider';
import { useVideoGenerateSuccess } from './types';
import { deleteVideo, getVideo } from '../action';
import { useAppDispatch, AppDispatch, useAppSelector } from '@store';
import { addProcess, removeProcess, reduceCoin } from '@store/user';

export function useVideoContainer(videos: VideosType[]): { renderVideos: VideosType[] } {
    const [ renderVideos, setRenderVideos ]: [ VideosType[], Dispatch<SetStateAction<VideosType[]>> ] = useState(videos);
    const { socket }: { socket: Socket | null } = useSocket();

    useEffect(() => {
        setRenderVideos(videos);
    }, [ videos ]);

    useEffect(() => {
        if (socket) {
            socket.on('generate:pending', ({ videoId }: { videoId: number }) => {
                if (renderVideos.find((video) => video.id === videoId)) {
                    const newVideos: VideosType[] = renderVideos.map((video) => {
                        if (video.id === videoId) return { ...video, status: 'pending' };
                        return video;
                    });
                    setRenderVideos(newVideos);
                }
            });

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

    return { renderVideos };
}

export function useVideo(id: number): useVideoReturn {
    const [ video, setVideo ]: [ VideoType | undefined | null, Dispatch<SetStateAction<VideoType | undefined | null>> ] = useState<VideoType | undefined | null>(undefined);
    const { socket }: { socket: Socket | null } = useSocket();

    const processing: number[] = useAppSelector((state) => state.user.processing);

    useEffect(() => {
        if (socket) {
            socket.on('generate:pending', ({ videoId }: { videoId: number }) => {
                if (video && video.id === videoId) setVideo({ ...video, status: 'pending' });
            });

            socket.on('generate:success', ({ videoId, audio_uri, image_uri, captions }: useVideoGenerateSuccess) => {
                if (video && video.id === videoId) setVideo({
                    ...video,
                    status: 'created',
                    audioUris: JSON.parse(audio_uri),
                    imageUris: JSON.parse(image_uri),
                    captions: JSON.parse(captions),
                });
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

    return { video, processing: processing.includes(id) };
}

export function useVideoActions(video: VideoType | undefined): useVideoActionsReturn {
    const [ status, setStatus ]: [ string, Dispatch<SetStateAction<string>> ] = useState('');

    const processing: number[] = useAppSelector((state) => state.user.processing);
    const dispatch: AppDispatch = useAppDispatch();

    async function regenerateVideo(): Promise<void> {
        if (video) {
            if (!processing.includes(video.id) && !status) {
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
    }

    async function removeVideo(): Promise<void> {
        if (video) {
            if (!processing.includes(video.id)) {
                dispatch(addProcess(video.id));

                const deletedId: number | void = await deleteVideo(video.id);
                if (deletedId) {
                    setTimeout(() => {
                        history.replaceState(null, '', `/video`);
                        location.reload();
                    }, 1);
                }

                dispatch(removeProcess(video.id));
            }
        }
    }

    return { status, setStatus, regenerateVideo, removeVideo };
}
