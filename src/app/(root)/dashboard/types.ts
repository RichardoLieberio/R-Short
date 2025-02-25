import { Dispatch, SetStateAction } from 'react';

export type useVideoReturn = {
    videos: VideoType[];
    loading: boolean;
    selectedVideo: VideoType | null;
    setSelectedVideo: Dispatch<SetStateAction<VideoType | null>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    prevPage: () => void;
    nextPage: () => void;
    getPages: () => number[];
};

export type VideoType = {
    id: number;
    audio_uri: string[];
    image_uri: string[];
    captions: { text: string; start: number; end: number, confidence: number, speaker: unknown }[][];
    created_at: Date;
};
