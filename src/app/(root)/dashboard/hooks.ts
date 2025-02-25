import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useVideoReturn, VideoType } from './types';
import { getVideos } from './action';

export function useVideo(count: number): useVideoReturn {
    const [ videos, setVideos ]: [ VideoType[], Dispatch<SetStateAction<VideoType[]>> ] = useState<VideoType[]>([]);
    const [ selectedVideo, setSelectedVideo ]: [ VideoType | null, Dispatch<SetStateAction<VideoType | null>> ] = useState<VideoType | null>(null);
    const [ page, setPage ]: [ number, Dispatch<SetStateAction<number>> ] = useState(1);
    const [ loading, setLoading ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);

    useEffect(() => {
        async function fetchVideos(): Promise<void> {
            setLoading(true);
            const videos: VideoType[] = await getVideos(count, page);
            setVideos(videos);
            setLoading(false);
        }

        fetchVideos();
    }, [ count, page ]);

    function prevPage(): void {
        if (page > 1) setPage((page) => page - 1);
    }

    function nextPage(): void {
        if (page < Math.ceil(count / 5)) setPage((page) => page + 1);
    }

    function getPages(): number[] {
        const totalPages: number = Math.ceil(count / 5);

        if (totalPages <= 1) return [ 1 ];
        if (totalPages <= 2) return [ 1, 2 ];
        if (totalPages <= 3) return [ 1, 2, 3 ];

        if (page === 1) return [ 1, 2, 3 ];
        if (page === totalPages) return [ totalPages - 2, totalPages - 1, totalPages ];

        return [ page - 1, page, page + 1 ];
    }

    return { videos, loading, selectedVideo, setSelectedVideo, page, setPage, prevPage, nextPage, getPages };
}
