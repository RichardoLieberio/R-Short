'use client';

import { JSX } from 'react';

import Link from 'next/link';
import { IoIosAdd } from 'react-icons/io';
import { Card } from '@components/shadcn/card';
import VideoCard from '../VideoCard';

import { useVideoContainer } from './hooks';

import { useVideoContainerReturn } from './types';
import { videoPreviewType } from '../../types';

type VideoContainerProps = {
    videos: videoPreviewType[];
    lastVideo: boolean;
};

export default function VideoContainer({ videos, lastVideo }: VideoContainerProps): JSX.Element {
    const { renderVideos }: useVideoContainerReturn = useVideoContainer(videos);

    return (
        <>
            {
                renderVideos.length < 5 && <Link href="/generate">
                    <Card className="w-32 h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                        <IoIosAdd className="text-2xl" />
                        <span>Create</span>
                    </Card>
                </Link>
            }
            {
                renderVideos.map((video) => <VideoCard key={video.id} video={video} lastVideo={lastVideo} />)
            }
        </>
    );
}
