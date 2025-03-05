import { JSX } from 'react';

import Link from 'next/link';
import MoonLoader from 'react-spinners/MoonLoader';
import { FaPlay } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { Card } from '@components/shadcn/card';

import { OffthreadVideo } from 'remotion';
import { Thumbnail } from '@remotion/player';

import { videoPreviewType } from '../../types';

type VideoCardProps = {
    video: videoPreviewType;
    lastVideo: boolean;
};

export default function VideoCard({ video, lastVideo }: VideoCardProps ): JSX.Element {
    return (
        <Link href={`/video/${video.id}${lastVideo ? '?last=1' : ''}`}>
            <Card className="relative w-32 h-48 rounded-lg overflow-hidden group">
                {
                    video.status === 'pending' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                        <MoonLoader size={20} color="#ffffff" speedMultiplier={0.8} />
                        <small className="text-xs md:text-sm">Generating</small>
                    </div>
                }
                {
                    video.status === 'created' && <>
                        <Thumbnail component={OffthreadVideo} compositionWidth={128} compositionHeight={192} frameToDisplay={1} durationInFrames={30} fps={30} inputProps={{ src: video.path!, pauseWhenBuffering: true }} className="transition-all duration-300 group-hover:brightness-50" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
                        </div>
                    </>
                }
                {
                    video.status === 'failed' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex jusitfy-center gap-1 text-destructive">
                        <MdErrorOutline className="text-xl" />
                        <small className="text-xs md:text-sm">Failed</small>
                    </div>
                }
            </Card>
        </Link>
    );
}
