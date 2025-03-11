import { JSX } from 'react';
import { db, Package } from '@database';
import CoinCard from './_components/CoinCard';
import { packageType } from './types';

export default async function Shop(): Promise<JSX.Element> {
    const packages: packageType[] = await db.select({ id: Package.id, coin: Package.coin, normalPrice: Package.normal_price, finalPrice: Package.final_price }).from(Package).orderBy(Package.id);

    return (
        <div className="flex flex-col md:flex-row gap-4">
            { packages.map((pkg) => <CoinCard key={`Coin-${pkg.id}`} pkg={pkg} />) }
        </div>
    );
}
