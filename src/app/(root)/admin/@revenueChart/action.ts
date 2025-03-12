'use server';

import { and, eq, sql } from 'drizzle-orm';
import { db, Transaction } from '@database';
import { dataType } from './types';

export async function fetchTransaction(type: string): Promise<dataType[]> {
    switch (type) {

    case 'seven-days':
        return await db.select({ date: sql`DATE(transaction_time)`, revenue: sql`SUM(${Transaction.amount})` })
            .from(Transaction)
            .where(and(eq(Transaction.status, 'success'), sql`transaction_time >= CURRENT_DATE - INTERVAL '6 days'`))
            .groupBy(sql`DATE(transaction_time)`)
            .orderBy(sql`DATE(transaction_time) DESC`)
            .then((result) => {
                const date: Date = new Date();

                const dates: Record<string, number> = {};
                Array.from({ length: 7 }).forEach((_, index) => {
                    const day: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6 + index);
                    dates[day.toDateString()] = 0;
                });

                result.forEach(({ date, revenue }: { date: unknown, revenue: unknown }) => {
                    const day: Date = new Date(date as string);
                    dates[day.toDateString()] = parseInt(revenue as string);
                });

                return Object.entries(dates).map(([ row, revenue ]: [ string, number ]) => ({ row, revenue }));
            });

    case 'four-weeks':
        return await db.select({ date: sql`DATE(transaction_time)`, revenue: sql`SUM(${Transaction.amount})` })
            .from(Transaction)
            .where(and(eq(Transaction.status, 'success'), sql`transaction_time >= CURRENT_DATE - INTERVAL '4 weeks'`))
            .groupBy(sql`DATE(transaction_time)`)
            .orderBy(sql`DATE(transaction_time) DESC`)
            .then((result) => {
                const date: Date = new Date();

                const weeks: Record<string, number> = {};
                Array.from({ length: 4 }).forEach((_, index) => {
                    const day: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 21 + index * 7);
                    weeks[day.toDateString()] = 0;
                });

                result.forEach(({ date, revenue }: { date: unknown, revenue: unknown }) => {
                    const day: Date = new Date(date as string);
                    const resultDay: Date = new Date(day.getFullYear(), day.getMonth(), day.getDate());

                    for (const week of Object.keys(weeks)) {
                        const date: Date = new Date(week);

                        if (resultDay <= date) {
                            weeks[week] += parseInt(revenue as string);
                            break;
                        }
                    }
                });

                return Object.entries(weeks).map(([ row, revenue ]: [ string, number ]) => ({ row, revenue }));
            });

    case 'six-months':
        return await db.select({ date: sql`DATE_TRUNC('month', transaction_time) AS month`, revenue: sql`SUM(${Transaction.amount})` })
            .from(Transaction)
            .where(and(eq(Transaction.status, 'success'), sql`transaction_time >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'`))
            .groupBy(sql`DATE_TRUNC('month', transaction_time)`)
            .orderBy(sql`DATE_TRUNC('month', transaction_time) DESC`)
            .then((result) => {
                const date: Date = new Date();

                const months: Record<string, number> = {};
                Array.from({ length: 6 }).forEach((_, index) => {
                    const day: Date = new Date(date.getFullYear(), date.getMonth() - 5 + index, date.getDate());
                    months[day.toDateString()] = 0;
                });

                result.forEach(({ date, revenue }: { date: unknown, revenue: unknown }) => {
                    const day: Date = new Date(date as string);
                    const resultDay: Date = new Date(day.getFullYear(), day.getMonth(), day.getDate());

                    for (const month of Object.keys(months)) {
                        const date: Date = new Date(month);

                        if (resultDay < date) {
                            months[month] += parseInt(revenue as string);
                            break;
                        }
                    }
                });

                return Object.entries(months).map(([ row, revenue ]: [ string, number ]) => ({ row, revenue }));
            });

    default:
        return await db.select({ date: sql`DATE_TRUNC('month', transaction_time) AS month`, revenue: sql`SUM(${Transaction.amount})` })
            .from(Transaction)
            .where(and(eq(Transaction.status, 'success'), sql`transaction_time >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months'`))
            .groupBy(sql`DATE_TRUNC('month', transaction_time)`)
            .orderBy(sql`DATE_TRUNC('month', transaction_time) DESC`)
            .then((result) => {
                const date: Date = new Date();

                const months: Record<string, number> = {};
                Array.from({ length: 12 }).forEach((_, index) => {
                    const day: Date = new Date(date.getFullYear(), date.getMonth() - 11 + index, date.getDate());
                    months[day.toDateString()] = 0;
                });

                result.forEach(({ date, revenue }: { date: unknown, revenue: unknown }) => {
                    const day: Date = new Date(date as string);
                    const resultDay: Date = new Date(day.getFullYear(), day.getMonth(), day.getDate());

                    for (const month of Object.keys(months)) {
                        const date: Date = new Date(month);

                        if (resultDay < date) {
                            months[month] += parseInt(revenue as string);
                            break;
                        }
                    }
                });

                return Object.entries(months).map(([ row, revenue ]: [ string, number ]) => ({ row, revenue }));
            });

    }
}
