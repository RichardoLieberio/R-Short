import { Dispatch, SetStateAction } from 'react';
import { Table } from '@tanstack/react-table';


export type useUserTableReturn = {
    setUsers: Dispatch<SetStateAction<userType[]>>;
    table: Table<userType>;
    columnsLength: number;
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
