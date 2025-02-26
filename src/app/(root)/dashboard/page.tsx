import { JSX, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@components/shadcn/button';
import VideoContainer from './_components/VideoContainer';

export const metadata: object = {
    title: 'R Short - AI Powered Short Video Generator',
    description: 'View and manage your AI-generated short videos. Access all your creations in one place.',
};

export default function DashboardPage(): JSX.Element {
    return (
        <div className="mt-12 md:mt-16 mb-16">
            <main className="mt-12 space-y-8 md:space-y-12">
                <header className="text-end">
                    <Link href="/generate">
                        <Button>Generate video</Button>
                    </Link>
                </header>
                <Suspense fallback={null}>
                    <VideoContainer />
                </Suspense>
            </main>
        </div>
    );
}
