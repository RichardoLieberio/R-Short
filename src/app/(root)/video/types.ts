export type VideoPageProps = {
    searchParams: Promise<{ page: string | string[] | undefined }>;
};

export type VideosType = {
    id: number;
    status: 'pending' | 'created' | 'failed';
    imageUri: string;
}

export type VideoContainerProps = {
    videos: VideosType[];
    lastVideo: boolean;
};

export type VideoPlayerProps = {
    videoNotFound: boolean;
    video: VideoType | undefined;
    small: boolean;
};

export type SceneProps = {
    scale: number;
    imageUri: string;
    audioUri: string;
    captions: Caption[],
};

export type VideoType = {
    id: number;
    status: 'pending' | 'created' | 'failed';
    style: string;
    duration: '15' | '30' | '60';
    storyboard: string;
    audioUris: string[];
    imageUris: string[];
    captions: Caption[][];
    createdAt: Date;
};

export type UnknownVideoType = {
    id: number;
    status: 'pending' | 'created' | 'failed';
    style: string;
    duration: '15' | '30' | '60';
    storyboard: string;
    audioUris: unknown;
    imageUris: unknown;
    captions: unknown;
    createdAt: Date;
};

export type Caption = {
    text: string;
    start: number;
    end: number;
    confidence: number;
    speaker: unknown;
};
