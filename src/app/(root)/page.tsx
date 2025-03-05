import { JSX } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@components/shadcn/button';
import Faqs from './_components/Faqs';

export default function RootPage(): JSX.Element {
    return (
        <div className="relative mb-16">
            <section className="mt-24 text-center">
                <h1 className="text-2xl md:text-4xl text-primary font-bold">Turn Ideas into Stunning Short Videos with AI</h1>
                <p className="mt-4">Create high quality short videos in seconds using the power of AI. Just input your idea, and let AI handle the rest!</p>
                <Link href="/generate">
                    <Button className="mt-6 md:text-base">Generate now</Button>
                </Link>
            </section>
            <Image src="/Pattern 1.png" alt="Pattern 1" width="400" height="400" quality={40} className="absolute -top-20 -left-72 translate-x-1/2 z-[-1]" />
            <Image src="/Pattern 2.png" alt="Pattern 2" width="400" height="400" quality={40} className="absolute -top-8 -right-28 z-[-1]" />
            <Image src="/Pattern 3.png" alt="Pattern 3" width="600" height="600" quality={40} className="absolute -top-60 left-1/2 -translate-x-1/2 z-[-1]" />
            <div className="mt-32">
                <h2 className="mb-4 text-lg md:text-xl">Frequently asked questions</h2>
                <Faqs />
            </div>
        </div>
    );
}
