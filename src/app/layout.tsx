import { NextFont } from 'next/dist/compiled/@next/font';
import { DM_Sans } from 'next/font/google';
import { ReactNode, JSX } from 'react';

import { dark } from '@clerk/themes';
import 'react-loading-skeleton/dist/skeleton.css';
import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import SocketProvider from '@components/SocketProvider';
import ClerkAuth from './_components/ClerkAuth';
import StoreProvider from './_components/StoreProvider';
import Script from 'next/script';

const dmSans: NextFont = DM_Sans({
    subsets: [ 'latin' ],
    display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <ClerkAuth>
                <StoreProvider>
                    <SocketProvider>
                        <html lang="en">
                            <Script src="https://app.sandbox.midtrans.com/snap/snap.js" key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} />
                            <body className={`${dmSans.className} w-full min-w-80 h-dvh relative text-sm md:text-base text-foreground bg-background overflow-x-hidden`}>
                                { children }
                            </body>
                        </html>
                    </SocketProvider>
                </StoreProvider>
            </ClerkAuth>
        </ClerkProvider>
    );
}
