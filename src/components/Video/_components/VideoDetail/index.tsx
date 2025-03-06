import { JSX } from 'react';
import Skeleton from '@components/Skeleton';
import { VideoType } from '../../types';

type VideoDetailProps = {
    videoNotFound: boolean;
    video: VideoType | undefined;
};

export default function VideoDetail({ videoNotFound, video }: VideoDetailProps): JSX.Element {
    function dateFormat(date: Date): string {
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).replace('at', '-');
    }

    return (
        <div className="flex flex-col gap-4">
            {
                !videoNotFound && <div className="h-5 flex items-center">
                    { video ? <span className="text-xs text-card-foreground/75 whitespace-nowrap">{ dateFormat(video.createdAt) }</span> : <Skeleton className="w-48 h-4" containerClassName="flex-1" /> }
                </div>
            }
            <div className="h-6 md:h-7 flex items-center gap-2">
                <small className="text-xs text-card-foreground/75 whitespace-nowrap">Style :</small>
                { videoNotFound ? <span>-</span> : (video ? <span>{ video.style }</span> : <Skeleton className="w-full h-5" containerClassName="flex-1" />) }
            </div>
            <div className="h-6 md:h-7 flex items-center gap-2">
                <small className="text-xs text-card-foreground/75 whitespace-nowrap">Duration :</small>
                { videoNotFound ? <span>-</span> : (video ? <span>{ video.duration } seconds</span> : <Skeleton className="w-full h-5" containerClassName="flex-1" />) }
            </div>
            <div>
                <small className="text-xs text-card-foreground/75 whitespace-nowrap">Storyboard :</small>
                { videoNotFound ? <p>-</p> : (video ? <p>{ video.storyboard }</p> : <Skeleton className="w-full h-20" />) }
            </div>
        </div>
    );
}
