import { useAppSelector, useAppDispatch, AppDispatch } from '@store';
import { setOpenShop } from '@store/user';
import { useShopDialogReturn } from './types';

export function useShopDialog(): useShopDialogReturn {
    const isOpen: boolean = useAppSelector((state) => state.user.openShop);
    const dispatch: AppDispatch = useAppDispatch();

    function setIsOpen(open: boolean): void {
        dispatch(setOpenShop(open));
    }

    return { isOpen, setIsOpen };
}
