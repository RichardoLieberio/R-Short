'use client';

import { JSX } from 'react';
import { useAppSelector } from '@store';
import { Card, CardHeader, CardTitle, CardDescription } from '@components/shadcn/card';
import Skeleton from '@components/Skeleton';
import { rupiahFormat } from '@lib/formatRupiah';

export default function TotalRevenue(): JSX.Element {
    const totalTransactions: number | null = useAppSelector((state) => state.user.totalTransactions);

    if (totalTransactions === null) return (
        <Skeleton className="h-[98px] md:h-[102px] rounded-xl" />
    );

    return (
        <Card className="bg-accent">
            <CardHeader>
                <CardTitle className="text-xs md:text-sm font-normal">Total revenue</CardTitle>
                <CardDescription className="text-lg md:text-xl text-foreground">{ rupiahFormat(totalTransactions) }</CardDescription>
            </CardHeader>
        </Card>
    );
}
