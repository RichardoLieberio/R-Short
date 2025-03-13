'use client';

import { JSX } from 'react';

import { flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@components/shadcn/table';
import { Input } from '@components/shadcn/input';
import { MdRefresh } from 'react-icons/md';
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
                <Table>
                    <TableHeader>
                        {
                            table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                { header.isPlaceholder ? null : flexRender( header.column.columnDef.header, header.getContext() )}
                                            </TableHead>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableHeader>
                    <TableBody>
                        {
                            table.getRowModel().rows?.length
                                ? table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {
                                            row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                                : <TableRow>
                                    <TableCell colSpan={columnsLength} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                        }
                    </TableBody>
                </Table>
            </main>
            <AdjustCoinDialog setUsers={setUsers} adjustCoin={adjustCoin} setAdjustCoin={setAdjustCoin} />
        </div>
    );
}
