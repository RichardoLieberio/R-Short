import { QueryResult } from '@neondatabase/serverless';

export type userType = {
    id: number;
    role: 'user' | 'admin';
    coin: number;
};

export type bodyType = {
    style: unknown;
    duration: unknown;
    storyboard: unknown;
};

export type parsedBodyType = {
    style: string;
    duration: '15' | '30' | '60';
    storyboard: string;
};

export type transactionReturn = [ { insertedId: number }[], QueryResult<never> ];
