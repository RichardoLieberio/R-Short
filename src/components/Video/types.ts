import { TranscriptWord } from 'assemblyai';

export type VideoType = {
    id: number;
    status: 'pending' | 'generated' | 'created' | 'failed';
    style: string;
    duration: '15' | '30' | '60';
    storyboard: string;
    path: string | null;
    folder: string | null;
    audioUris: string[] | null,
    imageUris: string[] | null,
    captions: TranscriptWord[][] | null,
    createdAt: Date;
};

export type useVideoReturn = {
    video: VideoType | undefined | null;
    processing: string | undefined;
};
