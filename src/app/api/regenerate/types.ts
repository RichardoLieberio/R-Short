import { QueryResult } from '@neondatabase/serverless';

export type userType = {
    id: number;
    role: 'user' | 'admin';
    coin: number;
};

export type videoType = {
    style: string;
    duration: '15' | '30' | '60';
    storyboard: string;
};

export type transactionReturn = [ videoType | undefined, QueryResult<never> ];
