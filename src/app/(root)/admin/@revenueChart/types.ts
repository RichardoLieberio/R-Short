import { Dispatch, SetStateAction } from 'react';

export type useRevenueChartReturn = {
    data: null | dataType[];
    type: string;
    setType: Dispatch<SetStateAction<string>>;
    getDescription: () => string;
    tickFormatter: (value: string) => string;
    labelFormatter: (value: string) => string;
    refreshRevenue: () => void;
};

export type dataType = {
    row: string;
    revenue: number;
}
