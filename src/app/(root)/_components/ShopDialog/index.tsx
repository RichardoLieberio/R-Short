'use client';

import { ReactNode, JSX, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@components/shadcn/dialog';
import Skeleton from '@components/Skeleton';
import { useShopDialog } from './hooks';
import { useShopDialogReturn } from './types';

export default function ShopDialog({ children }: { children: ReactNode }): JSX.Element {
    const { isOpen, setIsOpen }: useShopDialogReturn = useShopDialog();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-fit max-w-none">
                <DialogHeader className="text-left">
                    <DialogTitle>Purchase Coins</DialogTitle>
                    <DialogDescription>Select the perfect coin package to enhance your experience</DialogDescription>
                </DialogHeader>
                <section className="mt-2">
                    <Suspense fallback={<div className="flex flex-col md:flex-row gap-4">{ Array.from({ length: 3 }).map((index) => <Skeleton key={`Skeleton-${index}`} className="w-full md:w-48 h-[58px] md:h-[134px] rounded-xl" />) }</div>}>
                        { children }
                    </Suspense>
                </section>
            </DialogContent>
        </Dialog>
    );
}
