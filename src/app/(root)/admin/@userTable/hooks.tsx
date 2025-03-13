import { useState, useEffect, Dispatch, SetStateAction, JSX } from 'react';

import { Table, Column, ColumnDef, ColumnFiltersState, Row, SortingState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/shadcn/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa6';
import { Button } from '@components/shadcn/button';

import { fetchUsers } from './action';
import { useUserTableReturn, userType } from './types';

export function useUserTable(): useUserTableReturn {
    const [ users, setUsers ]: [ userType[], Dispatch<SetStateAction<userType[]>> ] = useState<userType[]>([]);
    const [ sorting, setSorting ]: [ SortingState, React.Dispatch<React.SetStateAction<SortingState>> ] = useState<SortingState>([]);
    const [ columnFilters, setColumnFilters ]: [ ColumnFiltersState, React.Dispatch<React.SetStateAction<ColumnFiltersState>> ] = useState<ColumnFiltersState>([]);

    useEffect(() => {
        async function getUsers(): Promise<void> {
            if (!users.length) {
                const users: userType[] = await fetchUsers();
                setUsers(users);
            }
        }

        getUsers();
    }, [ users ]);

    const columns: ColumnDef<userType>[] = [
        {
            id: 'actions',
            enableHiding: false,
            cell: (): JSX.Element => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Make admin</DropdownMenuItem>
                        <DropdownMenuItem>Adjust coins</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
        {
            accessorKey: 'email',
            header: ({ column }: { column: Column<userType, unknown> }): JSX.Element => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 whitespace-nowrap">
                    Email
                    { column.getIsSorted() === 'asc' ? <FaCaretUp /> : <FaCaretDown /> }
                </div>
            ),
            cell: ({ row }: { row: Row<userType> }) => (
                <div className="lowercase whitespace-nowrap">{ row.getValue('email') }</div>
            ),
        },
        {
            accessorKey: 'role',
            header: ({ column }: { column: Column<userType, unknown> }): JSX.Element => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 whitespace-nowrap">
                    Role
                    { column.getIsSorted() === 'asc' ? <FaCaretUp /> : <FaCaretDown /> }
                </div>
            ),
            cell: ({ row }: { row: Row<userType> }) => (
                <div className="lowercase whitespace-nowrap">{ row.getValue('role') }</div>
            ),
        },
        {
            accessorKey: 'coin',
            header: ({ column }: { column: Column<userType, unknown> }): JSX.Element => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 whitespace-nowrap">
                    Coin
                    { column.getIsSorted() === 'asc' ? <FaCaretUp /> : <FaCaretDown /> }
                </div>
            ),
            cell: ({ row }: { row: Row<userType> }) => (
                <div className="whitespace-nowrap">{ row.getValue('coin') }</div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }: { column: Column<userType, unknown> }): JSX.Element => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 whitespace-nowrap">
                    Created at
                    { column.getIsSorted() === 'asc' ? <FaCaretDown /> : <FaCaretDown /> }
                </div>
            ),
            cell: ({ row }: { row: Row<userType> }) => (
                <div className="whitespace-nowrap">{ (row.getValue('createdAt') as Date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) }</div>
            ),
        },
    ];

    const table: Table<userType> = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, columnFilters },
    });

    return { setUsers, table, columnsLength: columns.length };
}
