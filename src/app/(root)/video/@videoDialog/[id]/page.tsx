'use client';

import { JSX } from 'react';
import { useParams, ReadonlyURLSearchParams, useSearchParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useVideoReturn } from './types';
import { useVideo } from './hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@components/shadcn/dialog';
import { Button } from '@components/shadcn/button';
import VideoPlayer from './_components/VideoPlayer';
import Skeleton from '@components/Skeleton';
import { FaTrashAlt, FaDownload } from 'react-icons/fa';
import PulseLoader from 'react-spinners/PulseLoader';

export default function VideoDialog(): JSX.Element {
    const { id }: { id: string } = useParams();

    const isValidInteger: boolean = /^[1-9]\d*$/.test(id);
    if (!isValidInteger) notFound();

    /*
        Not working block
    */
    const searchParams: ReadonlyURLSearchParams = useSearchParams();
    const page: string = searchParams.get('page') ?? '1';
    console.log(page);
    /*
        Not working block
    */

    const router: AppRouterInstance = useRouter();
    const { video, videoNotFound, height, removeVideo, deleting }: useVideoReturn = useVideo(+id);

    function closeDialog(open: boolean): void {
        if (!open) {
            router.back();
            setTimeout(() => history.pushState(null, '', window.location.href), 1);
        }
    }

    const widthPx: string = `${(height * 2 / 3).toString()}px`;
    const heightPx: string = `${height.toString()}px`;

    return (
        <Dialog open onOpenChange={closeDialog}>
            <DialogContent className="w-fit lg:max-w-none p-0 bg-transparent border-none lg:flex lg:gap-16">
                <DialogHeader hidden className="hidden">
                    <DialogTitle hidden>Video Dialog</DialogTitle>
                    <DialogDescription hidden>Video dialog</DialogDescription>
                </DialogHeader>
                {
                    videoNotFound
                        ? <div style={{ width: widthPx, height: heightPx }} className="bg-black flex items-center justify-center">
                            Video not found
                        </div>
                        : (
                            video
                                ? <VideoPlayer width={height * 2 / 3} height={height} video={video} />
                                : <Skeleton width={widthPx} height={heightPx} />
                        )
                }
                <DialogFooter className="lg:flex-col lg:justify-start lg:gap-12">
                    <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <Button variant="destructive" onClick={() => removeVideo()} disabled={deleting || !video || videoNotFound}>
                            <span className={`${deleting && 'text-transparent'} flex items-center gap-2`}><FaTrashAlt /> Delete</span>
                            { deleting && <div className="absolute"><PulseLoader color="#fafafa" size={4} /></div> }
                        </Button>
                        <Button disabled={!video || videoNotFound}>
                            <FaDownload /> Download
                        </Button>
                    </div>
                    <div className="w-96 hidden lg:flex flex-col gap-8 ">
                        <div>
                            <small className="text-xs">Style :</small>
                            { videoNotFound ? <p>-</p> : (video ? <p>{ video.style }</p> : <Skeleton className="w-full h-5" />) }
                        </div>
                        <div>
                            <small className="text-xs">Duration :</small>
                            { videoNotFound ? <p>-</p> : (video ? <p>{ video.duration } seconds</p> : <Skeleton className="w-full h-5" />) }
                        </div>
                        <div>
                            <small className="text-xs">Storyboard :</small>
                            { videoNotFound ? <p>-</p> : (video ? <p>{ video.storyboard }</p> : <Skeleton className="w-full h-20" />) }
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
