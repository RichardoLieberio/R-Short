import { JSX } from 'react';
import { db, Package } from '@database';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from '@components/shadcn/card';
import { Button } from '@components/shadcn/button';
import { packageType } from './types';

export default async function Shop(): Promise<JSX.Element> {
    const packages: packageType[] = await db.select({ id: Package.id, coin: Package.coin, normalPrice: Package.normal_price, finalPrice: Package.final_price }).from(Package);

    function rupiahFormat(price: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {
                packages.map((pkg) => (
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
                            <Button className="md:w-full">Purchase</Button>
                        </CardFooter>
                    </Card>
                ))
            }
        </div>
    );
}
