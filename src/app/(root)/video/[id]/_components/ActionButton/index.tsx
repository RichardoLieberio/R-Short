'use client';

import { VideoType } from '../../../types';
import { JSX } from 'react';
import { useActionButton } from '../hooks';
import { Button } from '@components/shadcn/button';
import { FaTrashAlt, FaDownload } from 'react-icons/fa';
import PulseLoader from 'react-spinners/PulseLoader';

export default function ActionButton({ video }: { video: VideoType | null }): JSX.Element {
    const { deleting, removeVideo }: { deleting: boolean, removeVideo: () => void } = useActionButton(video?.id);

    return (
        <>
            <Button variant="destructive" onClick={() => removeVideo()} disabled={deleting || !video}>
                <span className={`${deleting && 'text-transparent'} flex items-center gap-2`}><FaTrashAlt /> Delete</span>
                { deleting && <div className="absolute"><PulseLoader color="#fafafa" size={4} /></div> }
            </Button>
            <Button disabled={!video}>
                <FaDownload /> Download
            </Button>
        </>
    );
}
