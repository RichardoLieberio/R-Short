import { useCurrentFrame, Sequence, interpolate } from 'remotion';
import Scene from './Scene.jsx';

export default function Video({ video, durations }) {
    const frame = useCurrentFrame();
    let accumulatedFrames = 0;

    return (
        <>
            {
                video.imageUris.map((imageUri, index) => {
                    const from = accumulatedFrames;
                    const outputRange = index % 2 ? [ 1.09, 1 ] : [ 1, 1.09 ];
                    const scale = interpolate(frame, [ from, from + durations[index] ], outputRange, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
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
