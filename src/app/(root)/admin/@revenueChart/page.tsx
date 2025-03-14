'use client';

import { JSX } from 'react';

import { Line, LineChart, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/shadcn/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@components/shadcn/chart';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/shadcn/select';
import Skeleton from '@components/Skeleton';
import { MdRefresh } from 'react-icons/md';

import { rupiahFormat } from '@lib/formatRupiah';
import { useRevenueChart } from './hooks';
import { useRevenueChartReturn } from './types';

const chartConfig: { desktop: { label: string, color: string } } = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

const types: Record<string, string> = {
    'seven-days': 'Last 7 days',
    'four-weeks': 'Last 4 weeks',
    'six-months': 'Last 6 months',
    'last-year': 'Last year',
};

export default function RevenueChart(): JSX.Element {
    const { type, setType, data, getDescription, tickFormatter, labelFormatter, refreshRevenue }: useRevenueChartReturn = useRevenueChart();

    if (!data) return (
        <Skeleton className="w-full aspect-[736/562] rounded-xl" />
    );

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="hidden sm:flex flex-col space-y-1.5">
                    <CardTitle>Revenue</CardTitle>
                    <CardDescription>{ getDescription() }</CardDescription>
                </div>
                <div className="flex-1 sm:flex-none flex items-start justify-between gap-8">
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                { Object.entries(types).map(([ type, text ]: string[]) => <SelectItem key={type} value={type}>{ text }</SelectItem>) }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div onClick={refreshRevenue} className="p-1 cursor-pointer">
                        <MdRefresh className="text-lg md:text-xl" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
                        <XAxis dataKey="row" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={tickFormatter} />
                        <ChartTooltip cursor content={
                            <ChartTooltipContent
                                hideIndicator
                                formatter={(value, name) => (
                                    <div className="space-x-4">
                                        <span className="text-muted-foreground">{ name }</span>
                                        <span>{ rupiahFormat(value as number) }</span>
                                    </div>
                                )}
                                labelFormatter={labelFormatter}
                            />
                        } />
                        <Line dataKey="revenue" type="linear" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Total revenue { rupiahFormat(data.reduce((total, cur) => total + cur.revenue, 0)) }
                </div>
                <div className="leading-none text-muted-foreground">
                    { type === 'all-time' ? 'Showing all time total revenue' : `Showing total revenue for the ${types[type].toLowerCase()}` }
                </div>
            </CardFooter>
        </Card>
    );
}
