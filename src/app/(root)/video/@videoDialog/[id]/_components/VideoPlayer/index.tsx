'use client';

import { VideoType } from '../../../../types';
import { JSX } from 'react';
import { usePlayer } from '../../hooks';
import { Player } from '@remotion/player';
import Video from '../Video';
import BlankScene from '../BlankScene';

export default function VideoPlayer({ width, height, video }: { width: number, height: number, video: VideoType }): JSX.Element {
    const { loading }: { loading: boolean } = usePlayer(video);

    const [ frames, durations ]: [ number, number[] ] = video.captions.reduce((obj: [ number, number[] ], captions) => {
        const frame: number = Math.ceil((captions.at(-1)!.end / 1000) * 30 + 15);
        return [ obj[0] + frame, [ ...obj[1], frame ] ];
    }, [ 0, [] ]);

    return (
        <Player
            component={loading ? Video : BlankScene}
            durationInFrames={frames}
            fps={30}
            compositionWidth={Math.round(width)}
            compositionHeight={Math.round(height)}
            inputProps={{ video, durations }}
            controls={loading}
            acknowledgeRemotionLicense
        />
    );
}
