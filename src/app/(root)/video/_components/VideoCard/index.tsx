import { JSX } from 'react';
import { Card } from '@components/shadcn/card';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';

export default function VideoCard({ imageUri }: { imageUri: string }): JSX.Element {
    return (
        <Card className="relative w-32 h-48 rounded-lg overflow-hidden group cursor-pointer">
            <Image src={imageUri} alt="Thumbnail" quality={20} width="128" height="192" unoptimized className="transition-all duration-300 group-hover:brightness-50" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
            </div>
        </Card>
    );
}
