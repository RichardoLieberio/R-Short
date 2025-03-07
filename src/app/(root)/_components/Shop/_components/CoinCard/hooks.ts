import { useAppDispatch, AppDispatch } from '@store';
import { setOpenShop } from '@store/user';
import { useCoinCardReturn } from './types';

export function useCoinCard(): useCoinCardReturn {
    const dispatch: AppDispatch = useAppDispatch();

    function rupiahFormat(price: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    }

    async function handlePurchase(packageId: number): Promise<void> {
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
    }

    return { rupiahFormat, handlePurchase };
}
