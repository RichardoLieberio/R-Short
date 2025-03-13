'use client';

import { JSX } from 'react';
import { Table as ReactTable, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@components/shadcn/table';
import { userType } from '../../types';

type UserDataTableProps = {
    table: ReactTable<userType>;
    columnsLength: number;
};

export default function UserDataTable({ table, columnsLength }: UserDataTableProps): JSX.Element {
    return (
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
    );
}
