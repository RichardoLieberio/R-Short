import { Dispatch, SetStateAction } from 'react';
import { VideoType } from '../types';

export type useVideoGenerateSuccess = {
    videoId: number;
    audio_uri: string;
    image_uri: string;
    captions: string;
};

export type useVideoReturn = {
    video: VideoType | undefined | null;
    processing: boolean;
};

export type useVideoActionsReturn = {
    status: string;
    setStatus: Dispatch<SetStateAction<string>>;
    regenerateVideo: () => void;
    removeVideo: () => void;
};
