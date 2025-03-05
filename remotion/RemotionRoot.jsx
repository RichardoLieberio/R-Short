import { Composition } from 'remotion';
import Video from './Video.jsx';

export default function RemotionRoot() {
    return (
        <Composition
            id="composition"
            component={Video}
            durationInFrames={30}
            fps={30}
            width={800}
            height={1200}
            calculateMetadata={({ props }) => ({
                durationInFrames: props.durations.reduce((total, duration) => total + duration, 0),
            })}
        />
    );
}
