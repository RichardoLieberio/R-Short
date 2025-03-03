import { VideoPageProps, VideosType } from './types';
import { JSX } from 'react';
import { notFound } from 'next/navigation';
import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { db, User, Video } from '@database';
import { eq, desc, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@components/shadcn/button';
import { Card } from '@components/shadcn/card';
import { IoIosAdd } from 'react-icons/io';
import VideoContainer from './_components/VideoContainer';
import VideoPagination from './_components/VideoPagination';

export default async function VideoPage({ searchParams }: VideoPageProps): Promise<JSX.Element> {
    const { page = '1' }: { page: string | string[] } = (await searchParams as { page: string | string[] });
    const pageValue: string = Array.isArray(page) ? page.at(0)! : page;

    const isValidInteger: boolean = /^[1-9]\d*$/.test(pageValue);
    if (!isValidInteger) notFound();

    const { userId }: ClerkMiddlewareAuthObject = await auth();
    const offset: number = (+pageValue - 1) * 5;

    const [ videos, total ]: [ VideosType[], number ] = await Promise.all([
        db.select({ id: Video.id, status: Video.status, imageUris: Video.image_uri })
            .from(Video)
            .innerJoin(User, eq(User.id, Video.user_id))
            .where(eq(User.clerk_id, userId!))
            .orderBy(desc(Video.created_at))
            .limit(5)
            .offset(offset)
            .then((results) => results.map((video) => ({
                id: video.id,
                status: video.status,
                imageUri: video.status === 'created' ? (video.imageUris as string[])[0] : '',
            }))),
        db.select({ total: sql<number>`COUNT(*)` })
            .from(Video)
            .innerJoin(User, eq(User.id, Video.user_id))
            .where(eq(User.clerk_id, userId!))
            .then(([ result ]: { total: number }[]) => result.total ?? 0),
    ]);

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
                    {
                        videos.length < 5 && <Link href="/generate">
                            <Card className="w-32 h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                                <IoIosAdd className="text-2xl" />
                                <span>Create</span>
                            </Card>
                        </Link>
                    }
                    <VideoContainer videos={videos} lastVideo={videos.length === 1 && +pageValue !== 1} />
                </main>
                <footer className="flex justify-center">
                    <VideoPagination page={+pageValue} total={total} />
                </footer>
            </main>
        </div>
    );
}
