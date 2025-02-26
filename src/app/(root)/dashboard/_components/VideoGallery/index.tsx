'use client';

import { JSX } from 'react';
import { useVideo } from '../../hooks';
import { useVideoReturn } from '../../types';
import Link from 'next/link';
import { Card } from '@/components/shadcn/card';
import { IoIosAdd } from 'react-icons/io';
import Skeleton from '@components/Skeleton';
import { Dialog, DialogTrigger, DialogContent } from '@components/shadcn/dialog';
import VideoCard from '../VideoCard';
import VideoPagination from '../VideoPagination';
// import VideoPlayer from '../VideoPlayer';

export default function VideoGallery({ count }: { count: number }): JSX.Element {
    const { total, videos, loading, deleting, page, setPage, prevPage, nextPage, getPages, removeVideo }: useVideoReturn = useVideo(count);

    return (
        <>
            <p>Results: {total ? `${(page - 1) * 5 + 1}-${Math.min(total, page * 5)} of ${total}` : 0}</p>
            <main className="w-[272px] min-[448px]:w-[416px] min-[592px]:w-[560px] min-[746px]:w-[704px] mx-auto flex flex-wrap justify-center gap-4">
                {
                    total < 5 && !loading && <Link href="/generate">
                        <Card className="w-32 h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                            <IoIosAdd className="text-2xl" />
                            <span>Create</span>
                        </Card>
                    </Link>
                }
                {
                    loading
                        ? Array.from({ length: 5 }).map((_, index) =>  <Skeleton key={index} className="w-32 h-48 rounded-lg" />)
                        : videos.map((video) => (
                            <Dialog key={video.id}>
                                <DialogTrigger asChild>
                                    <button onClick={(e) => deleting.includes(video.id) && e.preventDefault()} className={deleting.includes(video.id) ? 'cursor-default' : ''}>
                                        <VideoCard video={video} deleting={deleting.includes(video.id)} imageUri={video.image_uri[0]} removeVideo={removeVideo} />
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    Hello
                                </DialogContent>
                            </Dialog>
                        ))
                }
            </main>
            <footer className="flex justify-center">
                <VideoPagination total={total} page={page} setPage={setPage} prevPage={prevPage} nextPage={nextPage} getPages={getPages} />
            </footer>
            {/* <VideoPlayer selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} /> */}
        </>
    );
}
