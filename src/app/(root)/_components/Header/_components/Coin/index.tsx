'use client';

import { JSX } from 'react';
import Image from 'next/image';
import Skeleton from '@components/Skeleton';
import { useCoin } from './hooks';

export default function Coin(): JSX.Element {
    const coin: number | null = useCoin();

    return (
        <div className={`${coin !== null && 'cursor-pointer'} ml-auto px-2 flex items-center gap-1`}>
            <Image src="/Coin.png" alt="Coin" width="20" height="20" quality={40} />
            { coin ?? <Skeleton className="w-4 h-5 md:h-6 rounded-sm" /> }
        </div>
    );
}
