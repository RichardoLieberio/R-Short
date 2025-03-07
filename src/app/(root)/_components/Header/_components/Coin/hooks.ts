import { useEffect } from 'react';
import { useAppSelector, AppDispatch, useAppDispatch } from '@store';
import { setCoin, setOpenShop } from '@store/user';
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

export function useOpenShop(): () => void {
    const dispatch: AppDispatch = useAppDispatch();

    function openShop(): void {
        dispatch(setOpenShop(true));
    }

    return openShop;
}
