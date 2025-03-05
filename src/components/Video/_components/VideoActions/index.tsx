'use client';

import { JSX } from 'react';

import { FaUndoAlt, FaTrashAlt, FaDownload } from 'react-icons/fa';
import { Button } from '@components/shadcn/button';
import { AlertDialog } from '@components/shadcn/alert-dialog';
import Skeleton from '@components/Skeleton';
import Alert from '@components/Alert';

import { useVideoActions } from './hooks';

import { useVideoActionsReturn } from './types';
import { VideoType } from '../../types';

type VideoActionsProps = {
    videoNotFound: boolean;
    video: VideoType | undefined;
    processing: boolean;
};

export default function VideoActions({ videoNotFound, video, processing }: VideoActionsProps): JSX.Element {
    const { status, setStatus, regenerateVideo, downloadVideo, removeVideo }: useVideoActionsReturn = useVideoActions(video);

    if (videoNotFound) return (
        <>
            <Button variant="destructive" disabled>
                <FaTrashAlt /> Delete
            </Button>
            <Button disabled>
                <FaDownload /> Download
            </Button>
        </>
    );

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
                    : <Button onClick={downloadVideo} disabled={processing || video.status !== 'created'}>
                        <FaDownload /> Download
                    </Button>
            }
            <AlertDialog open={!!status}>
                <Alert status={status} setStatus={setStatus} navigate={false} />
            </AlertDialog>
        </>
    );
}
