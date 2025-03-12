'use client';

import { JSX } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from '@components/shadcn/card';
import { Button } from '@components/shadcn/button';
import { rupiahFormat } from '@lib/formatRupiah';
import { useCoinCard } from './hooks';
import { useCoinCardReturn } from './types';
import { packageType } from '../../types';

export default function CoinCard({ pkg }: { pkg: packageType }): JSX.Element {
    const { handlingPurchase, handlePurchase }: useCoinCardReturn = useCoinCard();

    return (
        <Card key={`Coin-${pkg.id}`} className="w-auto md:w-48 p-2 md:p-4 flex flex-row md:flex-col items-center gap-4">
            <div className="w-full flex justify-between items-center md:items-start gap-4">
                <CardHeader className="w-12 md:w-auto p-0">
                    <div className="flex items-center md:justify-center">
                        <Image src="/Coin.png" alt="Coin" width="24" height="24" quality={40} />
                        <p className="text-lg md:text-xl">{ pkg.coin }</p>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 md:text-end">
                    <p>{ rupiahFormat(pkg.finalPrice) }</p>
                    <small className="text-card-foreground/75 text-xs line-through">{ rupiahFormat(pkg.normalPrice) }</small>
                </CardContent>
            </div>
            <CardFooter className="p-0 md:w-full">
                <Button onClick={() => handlePurchase(pkg.id)} disabled={handlingPurchase} className="md:w-full">Purchase</Button>
            </CardFooter>
        </Card>
    );
}
