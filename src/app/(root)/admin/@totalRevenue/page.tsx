import { JSX } from 'react';
import { sql } from 'drizzle-orm';
import { db, Transaction } from '@database';
import { Card, CardHeader, CardTitle, CardDescription } from '@components/shadcn/card';
import { rupiahFormat } from '@lib/formatRupiah';

export default async function TotalRevenue(): Promise<JSX.Element> {
    const { total }: { total: number } = await db.select({ total: sql<number>`SUM(amount)` })
        .from(Transaction)
        .then((result) => result[0]);

    return (
        <Card className="bg-accent">
            <CardHeader>
                <CardTitle className="text-xs md:text-sm font-normal">Total revenue</CardTitle>
                <CardDescription className="text-lg md:text-xl text-foreground">{ rupiahFormat(total) }</CardDescription>
            </CardHeader>
        </Card>
    );
}
