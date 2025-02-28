import { VideoType } from '../../types';
import { Caption } from '../../types';

export type useVideoReturn = {
    video: VideoType | null;
    videoNotFound: boolean;
    height: number;
    removeVideo: () => void;
    deleting: boolean;
};

export type VideoPlayerProps = {
    height: number;
    videoNotFound: boolean;
    video: VideoType | null;
};

export type SceneProps = {
    scale: number;
    imageUri: string;
    audioUri: string;
    captions: Caption[],
};
