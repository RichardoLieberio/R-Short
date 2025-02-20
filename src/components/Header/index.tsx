import Image from 'next/image';
import Link from 'next/link';
import { JSX, Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { db, User } from '@database';

import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@components/shadcn/button';

export default function Header(): JSX.Element {
    return (
        <header className="h-16 flex items-center gap-8">
            <Link href="/">
                <Image src="/IconText.png" alt="R-Short Icon" width="36" height="36" priority />
            </Link>
            <SignedIn>
                <div className="flex-1 flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-4">
                        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                        <Suspense fallback={null}>
                            <NavMenu />
                        </Suspense>
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

async function NavMenu(): Promise<JSX.Element | null> {
    const { userId }: { userId: string | null } = await auth();
    if (!userId) return null;

    const user: { role: 'user' | 'admin', coin: number } | undefined = await db.select({ role: User.role, coin: User.coin })
        .from(User)
        .where(eq(User.clerk_id, userId))
        .limit(1)
        .then((res) => res[0]);

    if (!user) return null;

    if (user.role === 'admin') return (
        <Link href="/admin" className="hover:underline">Admin</Link>
    );

    return (
        <div className="ml-auto px-2 flex items-center gap-1 cursor-pointer">
            <Image src="/Coin.png" alt="Coin" width="20" height="20" quality={40} />
            { user.coin }
        </div>
    );
}
