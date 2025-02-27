'use client';

import { JSX } from 'react';
import { useVideo, useDialog } from '../../hooks';
import { useVideoReturn, useDialogReturn } from '../../types';
import Link from 'next/link';
import { Card } from '@components/shadcn/card';
import { IoIosAdd } from 'react-icons/io';
import Skeleton from '@components/Skeleton';
import VideoCard from '../VideoCard';
import VideoDialog from '../VideoDialog';
import VideoPagination from '../VideoPagination';

export default function VideoGallery({ count }: { count: number }): JSX.Element {
    const { total, videos, loading, deleting, page, setPage, prevPage, nextPage, getPages, removeVideo }: useVideoReturn = useVideo(count);
    const { open, setOpen, video, openDialog }: useDialogReturn = useDialog();

    return (
        <>
            <p>Results: {total ? `${(page - 1) * 5 + 1}-${Math.min(total, page * 5)} of ${total}` : 0}</p>
            <main className="w-[272px] min-[448px]:w-[416px] min-[592px]:w-[560px] min-[746px]:w-[704px] mx-auto flex flex-wrap justify-center gap-4">
                {
                    videos.length < 5 && !loading && <Link href="/generate">
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
                            <button key={video.id} onClick={() => openDialog(video)}>
                                <VideoCard imageUri={video.image_uri[0]} />
                            </button>
                        ))
                }
                <VideoDialog open={open} setOpen={setOpen} disabled={!!(video && deleting.includes(video.id))} video={video!} removeVideo={removeVideo} />
            </main>
            <footer className="flex justify-center">
                <VideoPagination total={total} page={page} setPage={setPage} prevPage={prevPage} nextPage={nextPage} getPages={getPages} />
            </footer>
        </>
    );
}
