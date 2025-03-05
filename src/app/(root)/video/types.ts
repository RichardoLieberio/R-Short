export type getVideosReturn = {
    videos: videoPreviewType[];
    total: number;
};

export type videoPreviewType = {
    id: number;
    status: 'pending' | 'created' | 'failed';
    path: string | null;
};
