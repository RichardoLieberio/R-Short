'use client';

import { JSX } from 'react';

import { OffthreadVideo } from 'remotion';
import { Player } from '@remotion/player';

import MoonLoader from 'react-spinners/MoonLoader';
import { MdErrorOutline } from 'react-icons/md';
import { CiWarning } from 'react-icons/ci';
import Skeleton from '@components/Skeleton';
import Video from '../Video';

import { usePlayer } from './hooks';

import { usePlayerReturn } from './types';
import { VideoType } from '../../types';

type VideoPlayerProps = {
    videoNotFound: boolean;
    video: VideoType | undefined;
    small: boolean;
};

export default function VideoPlayer({ videoNotFound, video, small }: VideoPlayerProps): JSX.Element {
    const { height, durationInFrames, imagesLoaded, error }: usePlayerReturn = usePlayer(video, small);

    const widthPx: string = `${(height * 2 / 3).toString()}px`;
    const heightPx: string = `${height.toString()}px`;

    if (videoNotFound) return (
        <div style={{ width: widthPx, height: heightPx }} className="px-4 flex items-center justify-center text-xs md:text-sm bg-black">
            Video not found
        </div>
    );

    if (!video) return (
        <Skeleton width={widthPx} height={heightPx} />
    );

    if (video.status === 'pending') return (
        <div style={{ width: widthPx, height: heightPx }} className="px-4 flex flex-col items-center justify-center gap-2 bg-black">
            <MoonLoader size={20} color="#ffffff" speedMultiplier={0.8} />
            <small className="text-xs md:text-sm">Generating</small>
        </div>
    );

    if (video.status === 'failed') return (
        <div style={{ width: widthPx, height: heightPx }} className="px-4 flex items-center justify-center gap-1 text-destructive bg-black">
            <MdErrorOutline className="text-xl" />
            <small className="text-xs md:text-sm">Failed</small>
        </div>
    );

    if (error) return (
        <div style={{ width: widthPx, height: heightPx }} className="px-4 flex items-center justify-center gap-1 bg-black ">
            <CiWarning className="text-xl" />
            <small className="text-xs md:text-sm">Something went wrong</small>
        </div>
    );

    if (!durationInFrames || (video.status === 'created' && !imagesLoaded)) return (
        <div style={{ width: widthPx, height: heightPx }} className="px-4 flex flex-col items-center justify-center bg-black">
            <MoonLoader size={20} color="#ffffff" speedMultiplier={0.8} />
        </div>
    );

    if (video.status === 'generated') return (
        <Player
            component={OffthreadVideo}
            compositionWidth={Math.round(height * 2 / 3)}
            compositionHeight={Math.round(height)}
            durationInFrames={durationInFrames}
            fps={30}
            controls
            inputProps={{ src: video.path!, pauseWhenBuffering: true, className: 'bg-black' }}
            acknowledgeRemotionLicense
        />
    );

    return (
        <Player
            component={Video}
            compositionWidth={Math.round(height * 2 / 3)}
            compositionHeight={Math.round(height)}
            durationInFrames={durationInFrames}
            fps={30}
            controls
            inputProps={{ video, height: Math.round(height) }}
            numberOfSharedAudioTags={ 0 }
            acknowledgeRemotionLicense
        />
    );
}
