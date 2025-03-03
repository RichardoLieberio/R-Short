'use client';

import { JSX } from 'react';
import { VideoType } from '../../types';
import { useVideo } from '../hooks';
import VideoPlayer from '../VideoPlayer';
import { Popover, PopoverContent, PopoverTrigger } from '@components/shadcn/popover';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import VideoDetail from '../VideoDetail';
import VideoActions from '../VideoActions';

export default function VideoSuspense({ id }: { id: number }): JSX.Element {
    const video: VideoType | undefined | null = useVideo(id);

    return (
        <div className="w-fit h-fit absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col lg:flex-row gap-4 lg:gap-16">
            <main className="relative">
                <VideoPlayer videoNotFound={video === null} video={video ? video : undefined} small={true} />
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="px-1 py-2 lg:hidden absolute top-0 right-0 cursor-pointer">
                            <IoMdInformationCircleOutline className="text-xl" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-80 lg:hidden">
                        <VideoDetail videoNotFound={video === null} video={video ? video : undefined} />
                    </PopoverContent>
                </Popover>
            </main>
            <footer className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 lg:flex-col lg:justify-start lg:gap-12">
                {
                    <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <VideoActions video={video ? video : undefined} />
                    </div>
                }
                <div className="hidden lg:block w-96">
                    <VideoDetail videoNotFound={video === null} video={video ? video : undefined} />
                </div>
            </footer>
        </div>
    );
}
