'use client';

import { VideoType } from '../../../types';
import { JSX } from 'react';
import { useActionButton } from '../hooks';
import { Button } from '@components/shadcn/button';
import { FaTrashAlt, FaDownload } from 'react-icons/fa';

export default function ActionButton({ video }: { video: VideoType | null }): JSX.Element {
    const { processing, removeVideo }: { processing: boolean, removeVideo: () => void } = useActionButton(video?.id);

    return (
        <>
            <Button variant="destructive" onClick={() => removeVideo()} disabled={processing || !video}>
                <FaTrashAlt /> Delete
            </Button>
            <Button disabled={processing || !video}>
                <FaDownload /> Download
            </Button>
        </>
    );
}
