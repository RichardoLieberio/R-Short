import { useEffect } from 'react';
import { useAppSelector, AppDispatch, useAppDispatch } from '@store';
import { setCoin } from '@store/user';
import { getUserCoin } from './action';

export function useCoin(): number | null {
    const coin: number | null = useAppSelector((state) => state.user.coin);
    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        async function fetchCoin(): Promise<void> {
            const coin: number = await getUserCoin();
            dispatch(setCoin(coin));
        }

        if (coin === null) fetchCoin();
    }, [ coin, dispatch ]);

    return coin;
}
