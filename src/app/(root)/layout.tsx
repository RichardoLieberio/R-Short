import { ReactNode, JSX } from 'react';
import Header from './_components/Header';
import ShopDialog from './_components/ShopDialog';
import Shop from './_components/Shop';

export const metadata: object = {
    title: 'R Short - AI Powered Short Video Generator',
    description: 'No editing skills needed. Just enter your concept, and our AI will generate a high quality video in seconds.',
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <div className="max-w-3xl md:mx-auto px-4">
            <Header />
            { children }
            <ShopDialog>
                <Shop />
            </ShopDialog>
        </div>
    );
}
