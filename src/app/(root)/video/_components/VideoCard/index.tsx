import { JSX } from 'react';
import Link from 'next/link';
import { Card } from '@components/shadcn/card';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';

export default function VideoCard({ id, imageUri, lastVideo }: { id: number, imageUri: string, lastVideo: boolean }): JSX.Element {
    return (
        <Link href={`/video/${id}${lastVideo ? '?last=1' : ''}`}>
            <Card className="relative w-32 h-48 rounded-lg overflow-hidden group">
                <Image src={imageUri} alt="Thumbnail" quality={20} width="128" height="192" unoptimized className="transition-all duration-300 group-hover:brightness-50" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
                </div>
            </Card>
        </Link>
    );
}
