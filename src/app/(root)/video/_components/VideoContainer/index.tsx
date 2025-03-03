'use client';

import { VideosType, VideoContainerProps } from '../../types';
import { JSX } from 'react';
import { useVideoContainer } from '../hooks';
import VideoCard from '../VideoCard';

export default function VideoContainer({ videos, lastVideo }: VideoContainerProps): JSX.Element {
    const { renderVideos }: { renderVideos: VideosType[] } = useVideoContainer(videos);

    return (
        <>
            {
                renderVideos.map((video) => <VideoCard key={video.id} video={video} lastVideo={lastVideo} />)
            }
        </>
    );
}
