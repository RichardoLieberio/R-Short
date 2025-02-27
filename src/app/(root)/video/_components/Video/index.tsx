'use client';

import { VideoType } from '../../types';
import { JSX } from 'react';
import { useCurrentFrame, Sequence, interpolate } from 'remotion';
import Scene from '../Scene';

export default function Video({ video, durations }: { video: VideoType, durations: number[] }): JSX.Element {
    const frame: number = useCurrentFrame();
    let accumulatedFrames: number = 0;

    return (
        <>
            {
                video.image_uri.map((imageUri, index) => {
                    const from: number = accumulatedFrames;
                    const outputRange: number[] = index % 2 ? [ 1.09, 1 ] : [ 1, 1.09 ];
                    const scale: number = interpolate(frame, [ from, from + durations[index] ], outputRange, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    accumulatedFrames += durations[index];

                    return (
                        <Sequence key={index} from={from} durationInFrames={durations[index]} premountFor={150}>
                            <Scene scale={scale} imageUri={imageUri} audioUri={video.audio_uri[index]} captions={video.captions[index]} />
                        </Sequence>
                    );
                })
            }
        </>
    );
}
