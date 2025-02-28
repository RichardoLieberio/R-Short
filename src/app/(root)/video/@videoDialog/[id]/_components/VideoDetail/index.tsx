import { VideoType } from '../../../../types';
import { JSX } from 'react';
import Skeleton from '@components/Skeleton';

export default function VideoDetail({ videoNotFound, video }: { videoNotFound: boolean, video: VideoType | null }): JSX.Element {
    return (
        <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2">
                <small className="text-xs text-card-foreground/75">Style :</small>
                { videoNotFound ? <span>-</span> : (video ? <span>{ video.style }</span> : <Skeleton className="w-full h-5" containerClassName="flex-1" />) }
            </span>
            <div className="flex items-center gap-2">
                <small className="text-xs text-card-foreground/75">Duration :</small>
                { videoNotFound ? <span>-</span> : (video ? <span>{ video.duration } seconds</span> : <Skeleton className="w-full h-5" containerClassName="flex-1" />) }
            </div>
            <div>
                <small className="text-xs text-card-foreground/75">Storyboard :</small>
                { videoNotFound ? <p>-</p> : (video ? <p>{ video.storyboard }</p> : <Skeleton className="w-full h-20" />) }
            </div>
        </div>
    );
}
