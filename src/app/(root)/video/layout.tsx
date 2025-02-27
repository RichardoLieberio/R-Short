import { ReactNode, JSX } from 'react';

export const metadata: object = {
    title: 'R Short - AI Powered Short Video Generator',
    description: 'View and manage your AI-generated short videos. Access all your creations in one place.',
};

export default function VideoLayout({ children, videoDialog }: { children: ReactNode, videoDialog: ReactNode }): JSX.Element {
    return (
        <>
            { children }
            { videoDialog }
        </>
    );
}
