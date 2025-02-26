'use client';

import { JSX } from 'react';
import { VideoCardProps } from '../../types';
import { Card } from '@components/shadcn/card';
import Image from 'next/image';
import { FaPlay, FaTrashAlt } from 'react-icons/fa';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from '@components/shadcn/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function VideoCard({ video, setSelectedVideo, imageUri, removeVideo }: VideoCardProps): JSX.Element {
    return (
        <Card onClick={() => setSelectedVideo(video)} className="relative w-32 h-48 rounded-lg overflow-hidden group cursor-pointer">
            <Image src={imageUri} alt="Thumbnail" quality={20} width="128" height="192" unoptimized className="transition-all duration-300 group-hover:brightness-50" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="px-1 py-2 absolute top-0 right-0 text-lg">
                            <BsThreeDotsVertical />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeVideo(video.id);
                                }}
                                className="flex items-center gap-2 text-destructive cursor-pointer"
                            >
                                <FaTrashAlt /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
}
