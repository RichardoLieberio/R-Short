'use client';

import { JSX } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useVideoReturn } from './types';
import { useVideo } from './hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@components/shadcn/dialog';
import { Button } from '@components/shadcn/button';
import VideoPlayer from '../../_components/VideoPlayer';
import { Popover, PopoverContent, PopoverTrigger } from '@components/shadcn/popover';
import VideoDetail from '../../_components/VideoDetail';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { FaTrashAlt, FaDownload } from 'react-icons/fa';

export default function VideoDialog(): JSX.Element {
    const largeScreen: boolean = useMediaQuery('(min-width: 1024px)');
    const { id }: { id: string } = useParams();

    const isValidInteger: boolean = /^[1-9]\d*$/.test(id);
    if (!isValidInteger) notFound();

    const router: AppRouterInstance = useRouter();
    const { video, videoNotFound, removeVideo, processing }: useVideoReturn = useVideo(+id);

    function closeDialog(open: boolean): void {
        if (!open) {
            router.back();
            setTimeout(() => history.pushState(null, '', window.location.href), 1);
        }
    }

    return (
        <Dialog open onOpenChange={closeDialog}>
            <DialogContent className="w-fit lg:max-w-none p-0 bg-transparent border-none lg:flex lg:gap-16">
                <DialogHeader hidden className="hidden">
                    <DialogTitle hidden>Video Dialog</DialogTitle>
                    <DialogDescription hidden>Video dialog</DialogDescription>
                </DialogHeader>
                <section className="relative">
                    <VideoPlayer videoNotFound={videoNotFound} video={video} small={false} />
                    {
                        !largeScreen && <Popover>
                            <PopoverTrigger asChild>
                                <div className="px-1 py-2 lg:hidden absolute top-0 right-0 cursor-pointer">
                                    <IoMdInformationCircleOutline className="text-xl" />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-80">
                                <VideoDetail videoNotFound={videoNotFound} video={video} />
                            </PopoverContent>
                        </Popover>
                    }
                </section>
                <DialogFooter className="lg:flex-col lg:justify-start lg:gap-12">
                    <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <Button variant="destructive" onClick={() => removeVideo()} disabled={processing || !video || videoNotFound}>
                            <FaTrashAlt /> Delete
                        </Button>
                        <Button disabled={processing || !video || videoNotFound}>
                            <FaDownload /> Download
                        </Button>
                    </div>
                    {
                        largeScreen && <div className="w-96">
                            <VideoDetail videoNotFound={videoNotFound} video={video} />
                        </div>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
