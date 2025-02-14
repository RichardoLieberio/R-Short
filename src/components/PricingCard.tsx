import { JSX } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardTitle } from '@components/shadcn/card';
import { Button } from '@components/shadcn/button';

type PricingCardProps = {
    rawPrice?: number,
    finalPrice: number,
    coin: number,
};

export default function PricingCard({ rawPrice, finalPrice, coin }: PricingCardProps): JSX.Element {
    return (
        <Card className="flex-1 min-w-48 max-w-64 text-card-foreground">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Image src="/Coin.png" alt="Coin" width="20" height="20" quality={40} />
                        <span>{coin}</span>
                    </div>
                    <div className="flex items-end gap-2 text-lg">
                        { rawPrice && <span className="text-base text-card-foreground/25 line-through">${rawPrice}</span> }
                        <span>${finalPrice}</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardFooter>
                <Button className="w-full">Purchase</Button>
            </CardFooter>
        </Card>
    );
}
