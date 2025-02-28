'use client';

import { VideoPlayerProps } from '../../types';
import { JSX } from 'react';
import { usePlayer } from '../../hooks';
import Skeleton from '@components/Skeleton';
import { Player } from '@remotion/player';
import Video from '../Video';
import BlankScene from '../BlankScene';

export default function VideoPlayer({ videoNotFound, video, small }: VideoPlayerProps): JSX.Element {
    const { height, loading }: { height: number, loading: boolean } = usePlayer(video, small);

    const widthPx: string = `${(height * 2 / 3).toString()}px`;
    const heightPx: string = `${height.toString()}px`;

    if (videoNotFound) return (
        <div style={{ width: widthPx, height: heightPx }} className="bg-black flex items-center justify-center">
            Video not found
        </div>
    );

    if (!video) return (
        <Skeleton width={widthPx} height={heightPx} />
    );

    const [ frames, durations ]: [ number, number[] ] = video.captions.reduce((obj: [ number, number[] ], captions) => {
        const frame: number = Math.ceil((captions.at(-1)!.end / 1000) * 30 + 15);
        return [ obj[0] + frame, [ ...obj[1], frame ] ];
    }, [ 0, [] ]);

    return (
        <Player
            component={loading ? Video : BlankScene}
            durationInFrames={frames}
            fps={30}
            compositionWidth={Math.round(height * 2 / 3)}
            compositionHeight={Math.round(height)}
            inputProps={{ video, durations }}
            controls={loading}
            acknowledgeRemotionLicense
        />
    );
}
