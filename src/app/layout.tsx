import { ReactNode, JSX } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <html>
            <body className="text-base">
                { children }
            </body>
        </html>
    );
}
