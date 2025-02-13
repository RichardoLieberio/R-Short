import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/shadcn/button';

export default function Header(): JSX.Element {
    return (
        <header className="md:mx-auto md:max-w-3xl h-16 px-4 flex items-center justify-between gap-4">
            <Link href="/">
                <Image src="/IconText.png" alt="R-Short Icon" width="36" height="36" quality={80} loading="lazy" />
            </Link>
            <SignedIn>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <div className="flex items-center gap-4">
                    <SignUpButton>
                        <span className="cursor-pointer hover:underline">Register</span>
                    </SignUpButton>
                    <SignInButton>
                        <Button>Login</Button>
                    </SignInButton>
                </div>
            </SignedOut>
        </header>
    );
}
