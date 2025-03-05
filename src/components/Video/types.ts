export type VideoType = {
    id: number;
    status: 'pending' | 'created' | 'failed';
    style: string;
    duration: '15' | '30' | '60';
    storyboard: string;
    path: string | null;
    createdAt: Date;
};

export type useVideoReturn = {
    video: VideoType | undefined | null;
    processing: boolean;
};
