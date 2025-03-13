'use client';

import { JSX } from 'react';

import { Input } from '@components/shadcn/input';
import { MdRefresh } from 'react-icons/md';
import UserDataTable from './_components/UserDataTable';
import AdjustCoinDialog from './_components/AdjustCoinDialog';

import { useUserTable } from './hooks';
import { useUserTableReturn } from './types';

export default function UserTable(): JSX.Element {
    const { setUsers, table, columnsLength, adjustCoin, setAdjustCoin }: useUserTableReturn = useUserTable();

    return (
        <div>
            <header className="flex items-start justify-between">
                <Input value={(table.getColumn('email')?.getFilterValue() as string) ?? ''} onChange={(e) => table.getColumn('email')?.setFilterValue(e.target.value)} placeholder="Search emails..." className="w-2/3 max-w-96" />
                <div onClick={() => setUsers([])} className="p-1 cursor-pointer">
                    <MdRefresh className="text-lg md:text-xl" />
                </div>
            </header>
            <main className="mt-4">
                <UserDataTable table={table} columnsLength={columnsLength} />
            </main>
            <AdjustCoinDialog setUsers={setUsers} adjustCoin={adjustCoin} setAdjustCoin={setAdjustCoin} />
        </div>
    );
}
