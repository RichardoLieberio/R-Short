import { JSX } from 'react';
import { useCurrentFrame, Sequence, interpolate } from 'remotion';
import Scene from '../Scene';
import { VideoType } from '../../types';

export default function Video({ video, height }: { video: VideoType, height: number }): JSX.Element {
    const frame: number = useCurrentFrame();
    const durations: number[] = video.captions!.map((captions) => Math.ceil((captions.at(-1)!.end / 1000) * 30 + 15));
    let accumulatedFrames: number = 0;

    return (
        <>
            {
                video.imageUris!.map((imageUri, index) => {
                    const from: number = accumulatedFrames;
                    const outputRange: number[] = index % 2 ? [ 1.09, 1 ] : [ 1, 1.09 ];
                    const scale: number = interpolate(frame, [ from, from + durations[index] ], outputRange, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    accumulatedFrames += durations[index];

                    return (
                        <Sequence key={index} from={from} durationInFrames={durations[index]} premountFor={150}>
                            <Scene fontSize={Math.round(height / 20)} scale={scale} imageUri={imageUri} audioUri={video.audioUris![index]} captions={video.captions![index]} />
                        </Sequence>
                    );
                })
            }
        </>
    );
}
