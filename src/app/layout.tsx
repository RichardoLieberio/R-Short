import { NextFont } from 'next/dist/compiled/@next/font';
import { DM_Sans } from 'next/font/google';
import { ReactNode, JSX } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import './globals.css';

const dmSans: NextFont = DM_Sans({
    subsets: [ 'latin' ],
    display: 'swap',
});

export const metadata: object = {
    title: 'R Short - AI Powered Short Video Generator',
    description: 'No editing skills needed. Just enter your concept, and our AI will generate a high quality video in seconds.',
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${dmSans.className} w-full h-dvh relative text-sm md:text-base text-foreground bg-background`}>
                    <Header />
                    { children }
                </body>
            </html>
        </ClerkProvider>
    );
}
