'use client';

import { JSX, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useAppSelector, AppDispatch, useAppDispatch } from '@store';
import { setCoin } from '@store/user';
import { getUserCoin } from './action';
import Image from 'next/image';
import Skeleton from '@components/Skeleton';

export default function Coin(): JSX.Element {
    const [ getCoin, setGetCoin ]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);

    const coin: number | null = useAppSelector((state) => state.user.coin);
    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        async function fetchCoin(): Promise<void> {
            const coin: number = await getUserCoin();
            dispatch(setCoin(coin));
            setGetCoin(true);
        }

        if (!getCoin) fetchCoin();
    }, [ getCoin, dispatch ]);

    return (
        <div className={`${getCoin && 'cursor-pointer'} ml-auto px-2 flex items-center gap-1`}>
            <Image src="/Coin.png" alt="Coin" width="20" height="20" quality={40} />
            {
                getCoin
                    ? coin
                    : <Skeleton className="w-4 h-5 md:h-6 rounded-sm" />
            }
        </div>
    );
}
