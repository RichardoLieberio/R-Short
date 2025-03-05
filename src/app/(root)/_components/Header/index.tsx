import { JSX } from 'react';
import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';

import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton, SignUpButton, SignInButton } from '@clerk/nextjs';
import { Button } from '@components/shadcn/button';
import Coin from './_components/Coin';

export default async function Header(): Promise<JSX.Element> {
    const { sessionClaims }: ClerkMiddlewareAuthObject = await auth();

    type SessionClaims = { metadata?: { role?: string } };
    const claims: SessionClaims = sessionClaims as SessionClaims;

    const isAdmin: boolean = claims?.metadata?.role === 'admin';

    return (
        <header className="h-16 flex items-center gap-8">
            <Link href="/">
                <Image src="/IconText.png" alt="R-Short Icon" width="36" height="36" priority />
            </Link>
            <SignedIn>
                <div className="flex-1 flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-4">
                        <Link href="/video" className="hover:underline">Video</Link>
                        {
                            isAdmin
                                ? <Link href="/admin" className="hover:underline">Admin</Link>
                                : <Coin />
                        }
                    </div>
                    <UserButton />
                </div>
            </SignedIn>
            <SignedOut>
                <div className="flex-1 flex items-center justify-end gap-4">
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
