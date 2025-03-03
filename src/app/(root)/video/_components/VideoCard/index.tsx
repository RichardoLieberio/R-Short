'use client';

import { VideosType } from '../../types';
import { JSX } from 'react';
import Link from 'next/link';
import { Card } from '@components/shadcn/card';
import MoonLoader from 'react-spinners/MoonLoader';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';

export default function VideoCard({ video, lastVideo }: { video: VideosType, lastVideo: boolean } ): JSX.Element {
    return (
        <Link href={`/video/${video.id}${lastVideo ? '?last=1' : ''}`}>
            <Card className="relative w-32 h-48 rounded-lg overflow-hidden group">
                {
                    video.status === 'pending' && <div className="w-32 h-48 absolute brightness-75 bg-black">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                            <MoonLoader size={20} color="#ffffff" speedMultiplier={0.8} />
                            <small className="text-xs md:text-sm">Generating</small>
                        </div>
                    </div>
                }
                {
                    video.status === 'created' && <>
                        <Image src={video.imageUri} alt="Thumbnail" quality={20} width="128" height="192" unoptimized className="transition-all duration-300 group-hover:brightness-50" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
                        </div>
                    </>
                }
                {
                    video.status === 'failed' && <div className="w-32 h-48 absolute bg-black">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex jusitfy-center gap-1 text-destructive">
                            <MdErrorOutline className="text-xl" />
                            <small className="text-xs md:text-sm">Error</small>
                        </div>
                    </div>
                }
            </Card>
        </Link>
    );
}
