import { Dispatch, SetStateAction } from 'react';
import { Table } from '@tanstack/react-table';

export type useUserTableReturn = {
    setUsers: Dispatch<SetStateAction<userType[]>>;
    table: Table<userType>;
    columnsLength: number;
    adjustCoin: { clerkId: string, email: string, coin: number } | boolean;
    setAdjustCoin: Dispatch<SetStateAction<{ clerkId: string, email: string, coin: number } | boolean>>;
};

export type userType = {
    clerkId: string;
    email: string;
    role: 'admin' | 'user';
    coin: number;
    createdAt: Date;
};

export type updateRoleReturn = {
    updatedClerkId: string;
    newRole: 'admin' | 'user';
} | void;
