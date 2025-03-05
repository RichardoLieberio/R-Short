import { ReactNode, JSX } from 'react';

export const metadata: object = {
    title: 'R Short - AI Powered Short Video Generator',
    description: 'Create AI-powered short videos instantly. Enter your concept, and watch our AI transform it into a stunning video within seconds.',
};

export default function GenerateLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <>{ children }</>
    );
}
