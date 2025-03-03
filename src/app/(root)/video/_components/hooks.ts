import { VideosType, VideoType } from '../types';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@components/SocketProvider';
import { useVideoGenerateSuccess } from './types';
import { deleteVideo, getVideo } from '../action';
import { useAppDispatch, AppDispatch, useAppSelector } from '@store';
import { addProcess, removeProcess } from '@store/user';

export function useVideoContainer(videos: VideosType[]): { renderVideos: VideosType[] } {
    const [ renderVideos, setRenderVideos ]: [ VideosType[], Dispatch<SetStateAction<VideosType[]>> ] = useState(videos);
    const { socket }: { socket: Socket | null } = useSocket();

    useEffect(() => {
        setRenderVideos(videos);
    }, [ videos ]);

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

    return { renderVideos };
}

export function useVideo(id: number): VideoType | undefined | null {
    const [ video, setVideo ]: [ VideoType | undefined | null, Dispatch<SetStateAction<VideoType | undefined | null>> ] = useState<VideoType | undefined | null>(undefined);
    const { socket }: { socket: Socket | null } = useSocket();

    useEffect(() => {
        if (socket) {
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

    return video;
}

export function useActionButton(id: number | undefined): { processing: boolean, removeVideo: () => void } {
    const processing: number[] = useAppSelector((state) => state.user.processing);
    const dispatch: AppDispatch = useAppDispatch();

    async function removeVideo(): Promise<void> {
        if (id) {
            if (!processing.includes(id)) {
                dispatch(addProcess(id));

                const deletedId: number | void = await deleteVideo(id);
                if (deletedId) {
                    setTimeout(() => {
                        history.replaceState(null, '', `/video`);
                        location.reload();
                    }, 1);
                }

                dispatch(removeProcess(id));
            }
        }
    }

    return { processing: id ? processing.includes(id) : false, removeVideo };
}
