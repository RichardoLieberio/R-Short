import { JSX } from 'react';
import { AbsoluteFill, Img, Audio, Sequence } from 'remotion';
import { TranscriptWord } from 'assemblyai';

type SceneProps = {
    fontSize: number;
    scale: number;
    imageUri: string;
    audioUri: string;
    captions: TranscriptWord[];
};

export default function Scene({ fontSize, scale, imageUri, audioUri, captions }: SceneProps): JSX.Element {
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
                            <div style={{ width: '100%', position: 'absolute', bottom: '20%', color: 'white', textAlign: 'center', fontSize: fontSize + 'px', textShadow: '2px 2px 2px rgba(0, 0, 0, 1)' }}>
                                {caption.text}
                            </div>
                        </Sequence>
                    );
                })
            }
        </AbsoluteFill>
    );
}
