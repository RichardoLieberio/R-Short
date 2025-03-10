import { AbsoluteFill, Img, Audio, Sequence } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';

export default function Scene({ scale, imageUri, audioUri, captions }) {
    const { fontFamily } = loadFont();

    return (
        <AbsoluteFill>
            <Img src={imageUri} pauseWhenLoading style={{ objectFit: 'cover', width: '100%', height: '100%', transform: `scale(${scale})`, backgroundColor: 'black' }} />
            <Audio src={audioUri} />
            {
                captions.map((caption, idx) => {
                    const startTime = Math.floor(((caption.start + 70) / 1000) * 30);
                    const duration = Math.floor(((caption.end - caption.start) / 1000) * 30);

                    return (
                        <Sequence key={idx} from={startTime} durationInFrames={duration}>
                            <div style={{ fontFamily, width: '100%', position: 'absolute', bottom: '20%', color: 'white', textAlign: 'center', fontSize: '60px', textShadow: '2px 2px 2px rgba(0, 0, 0, 1)' }}>
                                {caption.text}
                            </div>
                        </Sequence>
                    );
                })
            }
        </AbsoluteFill>
    );
}
