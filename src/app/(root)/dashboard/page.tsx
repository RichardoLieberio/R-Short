import { JSX, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@components/shadcn/button';
import VideoContainer from './_components/VideoContainer';

export default function DashboardPage(): JSX.Element {
    return (
        <div className="mt-12 md:mt-16">
            <main className="mt-12 space-y-8 md:space-y-12">
                <header className="flex items-center justify-between">
                    <p>Results: 1-3 of 3</p>
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
