import { JSX } from 'react';
import { notFound } from 'next/navigation';

import Link from 'next/link';
import { Button } from '@components/shadcn/button';
import VideoContainer from './_components/VideoContainer';
import VideoPagination from './_components/VideoPagination';

import { getVideos } from './action';

import { getVideosReturn } from './types';

type VideoPageProps = { searchParams: Promise<{ page: string | string[] | undefined }> };
export default async function VideoPage({ searchParams }: VideoPageProps): Promise<JSX.Element> {
    type searchParamsType = { page: string | string[] };
    const { page = '1' }: searchParamsType = (await searchParams as searchParamsType);
    const pageValue: string = Array.isArray(page) ? page.at(0)! : page;

    const isValidInteger: boolean = /^[1-9]\d*$/.test(pageValue);
    if (!isValidInteger) notFound();

    const offset: number = (+pageValue - 1) * 5;
    const { videos, total }: getVideosReturn = await getVideos(offset);

    if (!videos.length && +pageValue !== 1) notFound();

    const startIndex: number = offset + 1;
    const endIndex: number = offset + videos.length;

    return (
        <div className="mt-12 md:mt-16 mb-16">
            <main className="mt-12 space-y-8 md:space-y-12">
                <header className="flex items-center justify-between">
                    <span>Result: { videos.length ? startIndex : '0' } - { endIndex } of { total }</span>
                    <Link href="/generate">
                        <Button>Generate video</Button>
                    </Link>
                </header>
                <main className="w-[272px] min-[448px]:w-[416px] min-[592px]:w-[560px] min-[746px]:w-[704px] mx-auto flex flex-wrap justify-center gap-4">
                    <VideoContainer videos={videos} lastVideo={videos.length === 1 && +pageValue !== 1} />
                </main>
                <footer className="flex justify-center">
                    <VideoPagination page={+pageValue} total={total} />
                </footer>
            </main>
        </div>
    );
}
