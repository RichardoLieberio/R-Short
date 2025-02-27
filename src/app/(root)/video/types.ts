import { Dispatch, SetStateAction } from 'react';

export type useVideoReturn = {
    total: number;
    videos: VideoType[];
    loading: boolean;
    deleting: number[];
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    prevPage: () => void;
    nextPage: () => void;
    getPages: () => number[];
    removeVideo: (id: number) => void;
};

export type useDialogReturn = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    video: VideoType | undefined;
    openDialog: (video: VideoType) => void;
};

export type usePlayerReturn = {
    loaded: boolean;
    height: number;
}

export type VideoDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    disabled: boolean;
    video: VideoType;
    removeVideo: (id: number) => void;
}

export type VideoPaginationProps = {
    total: number;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    prevPage: () => void;
    nextPage: () => void;
    getPages: () => number[];
};

export type VideoType = {
    id: number;
    style: string;
    duration: '15' | '30' | '60';
    storyboard: string;
    audio_uri: string[];
    image_uri: string[];
    captions: { text: string; start: number; end: number, confidence: number, speaker: unknown }[][];
    created_at: Date;
};

export type SceneProps = {
    scale: number;
    imageUri: string;
    audioUri: string;
    captions: {
        text: string;
        start: number;
        end: number;
        confidence: number;
        speaker: unknown
    }[],
};
