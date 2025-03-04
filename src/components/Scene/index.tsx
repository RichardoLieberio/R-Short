import { SceneProps } from './types';
import { JSX } from 'react';
import { AbsoluteFill, Img, Audio, Sequence } from 'remotion';

export default function Scene({ scale, imageUri, audioUri, captions }: SceneProps): JSX.Element {
    return (
        <AbsoluteFill>
            <Img src={imageUri} pauseWhenLoading style={{ objectFit: 'cover', width: '100%', height: '100%', transform: `scale(${scale})`, backgroundColor: 'black' }} />
            <Audio src={audioUri} />
            {
                captions.map((caption, idx) => {
                    const startTime: number = Math.floor(((caption.start + 70) / 1000) * 30);
                    const duration: number = Math.floor(((caption.end - caption.start) / 1000) * 30);

                    return (
                        <Sequence key={idx} from={startTime} durationInFrames={duration}>
                            <div className="w-full absolute bottom-24 text-center text-2xl drop-shadow-[2px_2px_2px_rgba(0,0,0,1)]">
                                {caption.text}
                            </div>
                        </Sequence>
                    );
                })
            }
        </AbsoluteFill>
    );
}
