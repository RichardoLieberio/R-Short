import { JSX } from 'react';
import { sql } from 'drizzle-orm';
import { db, User } from '@database';
import { Card, CardHeader, CardTitle, CardDescription } from '@components/shadcn/card';
import { FaUser } from 'react-icons/fa6';

export default async function TotalUser(): Promise<JSX.Element> {
    const { total }: { total: number } = await db.select({ total: sql<number>`COUNT(*)` })
        .from(User)
        .then((result) => result[0]);

    return (
        <Card className="bg-secondary">
            <CardHeader>
                <CardTitle className="text-xs md:text-sm font-normal">Total user</CardTitle>
                <CardDescription className="text-lg md:text-xl text-foreground flex items-center gap-2">
                    <FaUser className="text-base md:text-lg" />
                    <span>{ total }</span>
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
