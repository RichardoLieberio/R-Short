import { useAppSelector, useAppDispatch, AppDispatch } from '@store';
import { setOpenShop, setHandlingPurchase } from '@store/user';
import { useCoinCardReturn } from './types';

export function useCoinCard(): useCoinCardReturn {
    const handlingPurchase: boolean = useAppSelector((state) => state.user.handlingPurchase);
    const dispatch: AppDispatch = useAppDispatch();

    async function handlePurchase(packageId: number): Promise<void> {
        if (!handlingPurchase) {
            dispatch(setHandlingPurchase(true));

            const response: Response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId }),
            });

            if (response.ok) {
                const { token }: { token: string } = await response.json();
                window.snap?.pay(token);
                dispatch(setOpenShop(false));
            }

            dispatch(setHandlingPurchase(false));
        }
    }

    return { handlingPurchase, handlePurchase };
}
