'use client';

import { JSX } from 'react';
import { Button } from '@components/shadcn/button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Table } from '@tanstack/react-table';
import { userType } from '../../types';

export default function UserTablePagination({ table }: { table: Table<userType> }): JSX.Element {
    const totalUsers: number = table.getCoreRowModel().rows.length;
    const totalPages: number = Math.ceil(totalUsers / 10);
    const currentPage: number = table.getState().pagination.pageIndex + 1;
    let pages: number[];

    if (totalPages <= 3) pages = Array.from({ length: totalPages }).map((_, index) => index + 1);
    else if (currentPage === 1) pages = [ 1, 2, 3 ];
    else if (currentPage === totalPages) pages = [ currentPage - 2, currentPage - 1, currentPage ];
    else pages = [ currentPage - 1, currentPage, currentPage + 1 ];

    return (
        <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm">Result: { totalUsers ? (currentPage - 1) * 10 + 1 : 0 } - { Math.min(currentPage * 10, totalUsers) } of { totalUsers }</span>
            <div className="flex items-center justify-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><IoIosArrowBack /></Button>
                { pages.map((page) => <Button key={`UserTable-${page}`} onClick={() => table.setPageIndex(page - 1)} variant={currentPage === page ? 'outline' : 'ghost'} size="sm">{ page }</Button>) }
                <Button size="sm" variant="ghost" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><IoIosArrowForward /></Button>
            </div>
        </div>
    );
}
