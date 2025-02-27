'use effect';

import { usePlayerReturn, VideoType } from '../../types';
import { JSX } from 'react';
import { usePlayer } from '../../hooks';
import { Player } from '@remotion/player';
import Video from '../Video';
import BlankScene from '../BlankScene';

export default function VideoPlayer({ video }: { video: VideoType }): JSX.Element {
    const { loaded, height }: usePlayerReturn = usePlayer(video);

    const [ frames, durations ]: [ number, number[] ] = video.captions.reduce((obj: [ number, number[] ], captions) => {
        const frame: number = Math.ceil((captions.at(-1)!.end / 1000) * 30 + 15);
        return [ obj[0] + frame, [ ...obj[1], frame ] ];
    }, [ 0, [] ]);

    return (
        <Player
            component={loaded ? Video : BlankScene}
            durationInFrames={frames}
            fps={30}
            compositionWidth={Math.round(height * 2 / 3)}
            compositionHeight={height}
            inputProps={{ video, durations }}
            controls={loaded}
            acknowledgeRemotionLicense
        />
    );
}
