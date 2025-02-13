import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import { Button } from '@/components/shadcn/button';

export default function Header(): JSX.Element {
    return (
        <header className="md:mx-auto md:max-w-3xl h-16 px-4 flex items-center justify-between">
            <Link href="/">
                <Image src="/IconText.png" alt="R-Short Icon" width="36" height="36" quality={80} loading="lazy" />
            </Link>
            <div className="flex items-center gap-4">
                <Link href="/register" className="hover:underline">Register</Link>
                <Link href="/login">
                    <Button>Login</Button>
                </Link>
            </div>
        </header>
    );
}
