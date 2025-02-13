import { JSX } from 'react';
import ReactSkeleton, { SkeletonTheme } from 'react-loading-skeleton';

type SkeletonPropsType = {
    baseColor?: string,
    highlightColor?: string,
    width?: string,
    height?: string,
    borderRadius?: string,
    count?: number,
    className?: string,
    containerClassName?: string,
}

export default function Skeleton({ baseColor, highlightColor, width, height, borderRadius, count, className, containerClassName }: SkeletonPropsType): JSX.Element {
    return (
        <SkeletonTheme baseColor={baseColor ?? '#1b1b22'} highlightColor={highlightColor ?? '#21212c'}>
            <ReactSkeleton width={width} height={height} borderRadius={borderRadius} count={count} className={className} containerClassName={containerClassName} />
        </SkeletonTheme>
    );
}
