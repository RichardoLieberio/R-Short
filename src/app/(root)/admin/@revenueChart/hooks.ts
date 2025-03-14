import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { AppDispatch, useAppDispatch } from '@store';
import { setTotalTransactions } from '@store/user';
import { useRevenueChartReturn, dataType } from './types';
import { fetchTransaction, fetchTotalTransaction } from './action';

export function useRevenueChart(): useRevenueChartReturn {
    const [ data, setData ]: [ null | dataType[], Dispatch<SetStateAction<null | dataType[]>> ] = useState<null | dataType[]>(null);
    const [ type, setType ]: [ string, Dispatch<SetStateAction<string>> ] = useState('seven-days');
    const [ isFetching, setIsFetching ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        async function getData(): Promise<void> {
            if (data === null && !isFetching) {
                setIsFetching(true);
                dispatch(setTotalTransactions(null));

                const data: dataType[] = await fetchTransaction(type);
                const total: number = await fetchTotalTransaction();
                setData(data);
                dispatch(setTotalTransactions(total));

                setIsFetching(false);
            }
        }

        getData();
    }, [ data, type, isFetching, dispatch ]);

    useEffect(() => {
        setData(null);
    }, [ type ]);

    function getDescription(): string {
        const date: Date = new Date();

        switch (type) {

        case 'seven-days':
            return `${new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} - ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`;

        case 'four-weeks':
            return `${new Date(date.getFullYear(), date.getMonth(), date.getDate() - 27).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} - ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`;

        case 'six-months':
            return `${new Date(date.getFullYear(), date.getMonth() - 5, date.getDate()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

        default:
            return `${new Date(date.getFullYear(), date.getMonth() - 11, date.getDate()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

        }
    }

    function tickFormatter(value: string): string {
        const date: Date = new Date(value);

        switch (type) {

        case 'seven-days':
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

        case 'four-weeks':
            return `${new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;

        case 'six-months':
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        default:
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

        }
    }

    function labelFormatter(value: string): string {
        const date: Date = new Date(value);

        switch (type) {

        case 'seven-days':
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

        case 'four-weeks':
            return `${new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} - ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`;

        case 'six-months':
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        default:
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        }
    }

    return { data, setData, type, setType, getDescription, tickFormatter, labelFormatter };
}
