'use client';

import { JSX } from 'react';
import { useVideo } from '../../hooks';
import { useVideoReturn } from '../../types';
import Skeleton from '@components/Skeleton';
import { Card } from '@components/shadcn/card';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';
import { Button } from '@components/shadcn/button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function VideoGallery({ count }: { count: number }): JSX.Element {
    const { videos, loading, selectedVideo, setSelectedVideo, page, setPage, prevPage, nextPage, getPages }: useVideoReturn = useVideo(count);

    return (
        <>
            <main className="w-[272px] min-[448px]:w-[416px] min-[592px]:w-[560px] min-[746px]:w-fit mx-auto flex flex-wrap gap-4">
                {
                    loading
                        ? Array.from({ length: 5 }).map((_, index) =>  <Skeleton key={index} className="w-32 h-48 rounded-lg" />)
                        : videos.map((video) => (
                            <Card key={video.id} onClick={() => setSelectedVideo(video)} className="relative w-32 h-48 rounded-lg overflow-hidden group cursor-pointer">
                                <Image src={video.image_uri[0]} alt="Thumbnail" quality={20} width="128" height="192" unoptimized className="transition-all duration-300 group-hover:brightness-50" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <FaPlay className="text-white text-xl" />
                                </div>
                            </Card>
                        ))
                }
            </main>
            <footer className="flex items-center justify-center gap-2">
                <Button variant="ghost" onClick={prevPage} disabled={page === 1}><IoIosArrowBack /></Button>
                {
                    getPages().map((buttonPage) => (
                        <Button key={buttonPage} onClick={() => setPage(buttonPage)} variant={buttonPage === page ? 'outline' : 'ghost'}>{ buttonPage }</Button>
                    ))
                }
                <Button variant="ghost" onClick={nextPage} disabled={page === Math.ceil(count / 5)}><IoIosArrowForward /></Button>
            </footer>
        </>
    );
}
