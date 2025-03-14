'use client';

import { JSX } from 'react';
import { useAppSelector } from '@store';
import { Card, CardHeader, CardTitle, CardDescription } from '@components/shadcn/card';
import Skeleton from '@components/Skeleton';
import { FaUser } from 'react-icons/fa6';

export default function TotalUser(): JSX.Element {
    const totalUsers: number | null = useAppSelector((state) => state.user.totalUsers);

    if (totalUsers === null) return (
        <Skeleton className="h-[98px] md:h-[102px] rounded-xl" />
    );

    return (
        <Card className="bg-secondary">
            <CardHeader>
                <CardTitle className="text-xs md:text-sm font-normal">Total user</CardTitle>
                <CardDescription className="text-lg md:text-xl text-foreground flex items-center gap-2">
                    <FaUser className="text-base md:text-lg" />
                    <span>{ totalUsers }</span>
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
