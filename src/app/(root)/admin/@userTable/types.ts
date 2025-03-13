import { Dispatch, SetStateAction } from 'react';
import { Table } from '@tanstack/react-table';


export type useUserTableReturn = {
    setUsers: Dispatch<SetStateAction<userType[]>>;
    table: Table<userType>;
    columnsLength: number;
};

export type userType = {
    email: string;
    role: 'admin' | 'user';
    coin: number;
    createdAt: Date;
};
