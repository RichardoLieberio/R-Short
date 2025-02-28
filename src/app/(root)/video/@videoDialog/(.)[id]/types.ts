import { VideoType } from '../../types';

export type useVideoReturn = {
    video: VideoType | null;
    videoNotFound: boolean;
    removeVideo: () => void;
    processing: boolean;
};
