'use client';

import { VideoType } from '../../types';
import { JSX } from 'react';
import { useActionButton } from '../hooks';
import Skeleton from '@components/Skeleton';
import { Button } from '@components/shadcn/button';
import { FaUndoAlt, FaTrashAlt, FaDownload } from 'react-icons/fa';

export default function VideoActions({ video }: { video: VideoType | undefined }): JSX.Element {
    const { processing, removeVideo }: { processing: boolean, removeVideo: () => void } = useActionButton(video?.id);

    if (!video) return (
        <Skeleton className="w-full h-9 rounded-md" containerClassName="flex-1" />
    );

    if (video.status === 'failed') return (
        <Button disabled={processing}>
            <FaUndoAlt /> Regenerate
        </Button>
    );

    return (
        <>
            <Button variant="destructive" onClick={() => removeVideo()} disabled={processing || video.status === 'pending'}>
                <FaTrashAlt /> Delete
            </Button>
            <Button disabled={processing || video.status === 'pending'}>
                <FaDownload /> Download
            </Button>
        </>
    );
}
