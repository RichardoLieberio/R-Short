'use client';

import { JSX } from 'react';
import { VideoPlayerProps } from '../../types';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@components/shadcn/alert-dialog';
import { Button } from '@components/shadcn/button';
import { CgClose } from 'react-icons/cg';
// import { AlertDialogContent as ShadcnAlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@components/shadcn/alert-dialog';

export default function VideoPlayer({ selectedVideo, setSelectedVideo }: VideoPlayerProps): JSX.Element {
    return (
        <AlertDialog open={!!selectedVideo}>
            <AlertDialogContent className="!p-0 !bg-transparent !border-none">
                <AlertDialogTitle className="hidden">Video Player</AlertDialogTitle>
                <div className="w-fit h-fit relative">
                    <div className="w-[400px] h-[600px] bg-red-200">

                    </div>
                    <Button onClick={() => setSelectedVideo(null)} variant="ghost" className="w-10 h-10 absolute top-0 left-full flex items-center justify-center">
                        <CgClose />
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
