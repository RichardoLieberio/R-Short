'use client';

import { VideoType } from '../../types';
import { JSX } from 'react';
import { useVideoActionsReturn } from '../types';
import { useVideoActions } from '../hooks';
import Skeleton from '@components/Skeleton';
import { Button } from '@components/shadcn/button';
import { FaUndoAlt, FaTrashAlt, FaDownload } from 'react-icons/fa';
import { AlertDialog } from '@components/shadcn/alert-dialog';
import Alert from '@components/Alert';

export default function VideoActions({ video, processing }: { video: VideoType | undefined, processing: boolean }): JSX.Element {
    const { status, setStatus, regenerateVideo, removeVideo }: useVideoActionsReturn = useVideoActions(video);

    if (!video) return (
        <Skeleton className="w-full h-9 rounded-md" containerClassName="flex-1" />
    );

    return (
        <>
            <Button variant="destructive" onClick={removeVideo} disabled={processing || video.status === 'pending'}>
                <FaTrashAlt /> Delete
            </Button>
            {
                video.status === 'failed'
                    ? <Button onClick={regenerateVideo} disabled={processing}>
                        <FaUndoAlt /> Regenerate
                    </Button>
                    : <Button disabled={processing || video.status === 'pending'}>
                        <FaDownload /> Download
                    </Button>
            }
            <AlertDialog open={!!status}>
                <Alert status={status} setStatus={setStatus} navigate={false} />
            </AlertDialog>
        </>
    );
}
