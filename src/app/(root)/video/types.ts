export type getVideosReturn = {
    videos: videoPreviewType[];
    total: number;
};

export type videoPreviewType = {
    id: number;
    status: 'pending' | 'generated' | 'created' | 'failed';
    path: string | null;
    imageUri: string | null;
};
