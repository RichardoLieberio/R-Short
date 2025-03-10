'use client';

import { JSX } from 'react';

import BeatLoader from 'react-spinners/BeatLoader';
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
    processing: string | undefined;
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
            <Button variant="destructive" onClick={removeVideo} disabled={!!processing || video.status === 'pending'}>
                <FaTrashAlt /> Delete
            </Button>
            {
                video.status === 'failed'
                    ? <Button onClick={regenerateVideo} disabled={!!processing}>
                        <span className={`${processing === 'delete' && 'text-transparent'} flex items-center justify-center gap-2`}><FaUndoAlt /> Regenerate</span>
                        { processing === 'delete' && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><BeatLoader color="#FFF" size={5} /></span> }
                    </Button>
                    : <Button onClick={downloadVideo} disabled={!!processing || (video.status !== 'created' && video.status !== 'generated')} className="relative">
                        <span className={`${processing === 'download' && 'text-transparent'} flex items-center justify-center gap-2`}><FaDownload /> Download</span>
                        { processing === 'download' && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><BeatLoader color="#FFF" size={5} /></span> }
                    </Button>
            }
            <AlertDialog open={!!status}>
                <Alert status={status} setStatus={setStatus} navigate={false} />
            </AlertDialog>
        </>
    );
}
