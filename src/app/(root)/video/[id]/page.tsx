import { JSX } from 'react';
import { notFound } from 'next/navigation';
import Video from '@components/Video';

export default async function VideoPlayerPage({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
    const { id }: { id: string } = await params;

    const isValidInteger: boolean = /^[1-9]\d*$/.test(id);
    if (!isValidInteger) notFound();

    return (
        <div className="mt-8 lg:mt-0">
            <Video id={+id} />
        </div>
    );
}
