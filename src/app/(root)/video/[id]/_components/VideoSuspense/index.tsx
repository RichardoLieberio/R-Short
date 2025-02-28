import { JSX } from 'react';
import { VideoType } from '../../../types';
import { getVideo } from '../../../action';
import VideoPlayer from '../../../_components/VideoPlayer';
import { Popover, PopoverContent, PopoverTrigger } from '@components/shadcn/popover';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import VideoDetail from '../../../_components/VideoDetail';
import ActionButton from '../ActionButton';

export default async function VideoSuspense({ id }: { id: number | null }): Promise<JSX.Element> {
    const video: VideoType | undefined | null = id ? await getVideo(+id) : null;

    return (
        <div className="w-fit h-fit mt-8 lg:mt-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col lg:flex-row gap-4 lg:gap-16">
            <main className="relative">
                <VideoPlayer videoNotFound={video === undefined} video={video ? video : null} small={true} />
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="px-1 py-2 lg:hidden absolute top-0 right-0 cursor-pointer">
                            <IoMdInformationCircleOutline className="text-xl" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-80 lg:hidden">
                        <VideoDetail videoNotFound={video === undefined} video={video ? video : null} />
                    </PopoverContent>
                </Popover>
            </main>
            <footer className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 lg:flex-col lg:justify-start lg:gap-12">
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                    <ActionButton video={video ? video : null} />
                </div>
                <div className="hidden lg:block w-96">
                    <VideoDetail videoNotFound={video === undefined} video={video ? video : null} />
                </div>
            </footer>
        </div>
    );
}
