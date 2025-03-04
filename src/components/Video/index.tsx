'use client';

import { VideoType } from '../../app/(root)/video/types';
import { JSX } from 'react';
import { useCurrentFrame, Sequence, interpolate } from 'remotion';
import Scene from '../../app/(root)/video/_components/Scene';

export default function Video({ video, durations }: { video: VideoType, durations: number[] }): JSX.Element {
    const frame: number = useCurrentFrame();
    let accumulatedFrames: number = 0;

    return (
        <>
            {
                video.imageUris.map((imageUri, index) => {
                    const from: number = accumulatedFrames;
                    const outputRange: number[] = index % 2 ? [ 1.09, 1 ] : [ 1, 1.09 ];
                    const scale: number = interpolate(frame, [ from, from + durations[index] ], outputRange, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    accumulatedFrames += durations[index];

                    return (
                        <Sequence key={index} from={from} durationInFrames={durations[index]} premountFor={150}>
                            <Scene scale={scale} imageUri={imageUri} audioUri={video.audioUris[index]} captions={video.captions[index]} />
                        </Sequence>
                    );
                })
            }
        </>
    );
}
