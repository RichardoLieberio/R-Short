import { Dispatch, SetStateAction } from 'react';

export type useVideoReturn = {
    total: number;
    videos: VideoType[];
    loading: boolean;
    selectedVideo: VideoType | null;
    setSelectedVideo: Dispatch<SetStateAction<VideoType | null>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    prevPage: () => void;
    nextPage: () => void;
    getPages: () => number[];
    removeVideo: (id: number) => void;
};

export type VideoCardProps = {
    video: VideoType;
    setSelectedVideo: Dispatch<SetStateAction<VideoType | null>>;
    imageUri: string;
    removeVideo: (id: number) => void;
};

export type VideoPaginationProps = {
    total: number;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    prevPage: () => void;
    nextPage: () => void;
    getPages: () => number[];
};

export type VideoPlayerProps = {
    selectedVideo: VideoType | null;
    setSelectedVideo: Dispatch<SetStateAction<VideoType | null>>;
};

export type VideoType = {
    id: number;
    audio_uri: string[];
    image_uri: string[];
    captions: { text: string; start: number; end: number, confidence: number, speaker: unknown }[][];
    created_at: Date;
};
