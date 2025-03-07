import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useAppDispatch, AppDispatch } from '@store';
import { setOpenShop } from '@store/user';

export function useDots(): string {
    const [ dot, setDot ]: [ string, Dispatch<SetStateAction<string>> ] = useState('');

    useEffect(() => {
        const dots: string[] = [ '', '.', '..', '...' ];
        let count: number = 0;

        const interval: NodeJS.Timeout = setInterval(() => {
            setDot(dots[count++ % dots.length]);
        }, 600);

        return (): void => clearInterval(interval);
    }, []);

    return dot;
}

export function useOpenShop(): () => void {
    const dispatch: AppDispatch = useAppDispatch();

    function openShop(): void {
        dispatch(setOpenShop(true));
    }

    return openShop;
}
