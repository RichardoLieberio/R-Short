import { JSX } from 'react';
import ReactSkeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { SkeletonProps } from './types';

export default function Skeleton({ baseColor, highlightColor, width, height, borderRadius, count, className, containerClassName }: SkeletonProps): JSX.Element {
    return (
        <SkeletonTheme baseColor={baseColor ?? '#1b1b22'} highlightColor={highlightColor ?? '#21212c'}>
            <ReactSkeleton width={width} height={height} borderRadius={borderRadius} count={count} className={className} containerClassName={containerClassName} />
        </SkeletonTheme>
    );
}
