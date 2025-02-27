import { JSX } from 'react';
import { VideoDialogProps } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from '@components/shadcn/dialog';
import VideoPlayer from '../VideoPlayer';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Button } from '@components/shadcn/button';
import { FaTrashAlt, FaDownload } from 'react-icons/fa';
import PulseLoader from 'react-spinners/PulseLoader';

export default function Testing({ open, setOpen, disabled, video, removeVideo }: VideoDialogProps): JSX.Element {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-fit p-0 bg-transparent border-none">
                <DialogHeader className="hidden">
                    <DialogTitle>Video player</DialogTitle>
                    <DialogDescription>Video player</DialogDescription>
                </DialogHeader>
                <VideoPlayer video={video} />
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="px-2 py-2 absolute top-0 right-0 cursor-pointer">
                            <IoMdInformationCircleOutline className="text-xl drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]" />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="hidden">
                            <DialogTitle>Video detail</DialogTitle>
                            <DialogDescription>Video detail</DialogDescription>
                        </DialogHeader>
                        <span>Hello</span>
                    </DialogContent>
                </Dialog>
                <DialogFooter className="gap-2">
                    <Button variant="destructive" onClick={() => removeVideo(video.id)} disabled={disabled}>
                        <span className={`${disabled && 'text-transparent'} flex items-center gap-2`}><FaTrashAlt /> Delete</span>
                        { disabled && <div className="absolute"><PulseLoader color="#fafafa" size={4} /></div> }
                    </Button>
                    <Button>
                        <FaDownload /> Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
