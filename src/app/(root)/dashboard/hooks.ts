import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useVideoReturn, VideoType } from './types';
import { getVideos, deleteVideo } from './action';

export function useVideo(count: number): useVideoReturn {
    const [ total, setTotal ]: [ number, Dispatch<SetStateAction<number>> ] = useState(count);
    const [ videos, setVideos ]: [ VideoType[], Dispatch<SetStateAction<VideoType[]>> ] = useState<VideoType[]>([]);
    const [ page, setPage ]: [ number, Dispatch<SetStateAction<number>> ] = useState(1);
    const [ loading, setLoading ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);
    const [ deleting, setDeleting ]: [ number[], Dispatch<SetStateAction<number[]>> ] = useState<number[]>([]);

    useEffect(() => {
        async function fetchVideos(): Promise<void> {
            setLoading(true);
            const videos: VideoType[] = await getVideos(total, page);
            setVideos(videos);
            setLoading(false);
        }

        fetchVideos();
    }, [ total, page ]);

    function prevPage(): void {
        if (page > 1) setPage((page) => page - 1);
    }

    function nextPage(): void {
        if (page < Math.ceil(total / 5)) setPage((page) => page + 1);
    }

    function getPages(): number[] {
        const totalPages: number = Math.ceil(total / 5);

        if (totalPages <= 1) return [ 1 ];
        if (totalPages <= 2) return [ 1, 2 ];
        if (totalPages <= 3) return [ 1, 2, 3 ];

        if (page === 1) return [ 1, 2, 3 ];
        if (page === totalPages) return [ totalPages - 2, totalPages - 1, totalPages ];

        return [ page - 1, page, page + 1 ];
    }

    async function removeVideo(id: number): Promise<void> {
        if (!deleting.includes(id)) {
            setDeleting((deleting) => [ ...deleting, id ]);

            const deletedId: number | void = await deleteVideo(id);
            if (deletedId) {
                setVideos((videos) => videos.filter((video) => video.id !== deletedId));
                setTotal((total) => total - 1);
            }

            setDeleting((deleting) => deleting.filter((deletingId) => deletingId !== id));
        }
    }

    return { total, videos, loading, deleting, page, setPage, prevPage, nextPage, getPages, removeVideo };
}
