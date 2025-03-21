import { useState, useEffect, Dispatch, SetStateAction, JSX } from 'react';

import { useAuth } from '@clerk/clerk-react';
import { useAppSelector, useAppDispatch, AppDispatch } from '@store';
import { addUserProcess, removeUserProcess, setTotalUsers } from '@store/user';

import { Table, Column, ColumnDef, ColumnFiltersState, Row, SortingState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/shadcn/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa6';
import { RiAdminFill, RiUserMinusFill, RiCoinFill } from 'react-icons/ri';
import { Button } from '@components/shadcn/button';

import { fetchUsers, updateRole } from './action';
import { useUserTableReturn, userType, updateRoleReturn } from './types';

export function useUserTable(): useUserTableReturn {
    const [ users, setUsers ]: [ userType[], Dispatch<SetStateAction<userType[]>> ] = useState<userType[]>([]);
    const [ sorting, setSorting ]: [ SortingState, React.Dispatch<React.SetStateAction<SortingState>> ] = useState<SortingState>([]);
    const [ columnFilters, setColumnFilters ]: [ ColumnFiltersState, React.Dispatch<React.SetStateAction<ColumnFiltersState>> ] = useState<ColumnFiltersState>([]);
    const [ adjustCoin, setAdjustCoin ]: [ { clerkId: string, email: string, coin: number } | boolean, Dispatch<SetStateAction<{ clerkId: string, email: string, coin: number } | boolean>> ] = useState<{ clerkId: string, email: string, coin: number } | boolean>(false);

    const dispatch: AppDispatch = useAppDispatch();
    const { userId }: { userId: string | null | undefined } = useAuth();

    const processingUser: { [ email: string ]: string } = useAppSelector((state) => state.user.processingUser);

    useEffect(() => {
        async function getUsers(): Promise<void> {
            if (!users.length) {
                dispatch(setTotalUsers(null));
                const users: userType[] = await fetchUsers();
                setUsers(users);
                dispatch(setTotalUsers(users.length));
            }
        }

        getUsers();
    }, [ users, dispatch ]);

    const columns: ColumnDef<userType>[] = [
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: { row: Row<userType> }): JSX.Element => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        {
                            row.getValue('role') === 'admin'
                                ? <DropdownMenuItem onClick={() => updateUserRole(row.original.clerkId, 'user')} disabled={processingUser[row.original.clerkId] === 'role' || row.original.clerkId === userId}>
                                    <RiUserMinusFill /> Remove admin
                                </DropdownMenuItem>
                                : <DropdownMenuItem onClick={() => updateUserRole(row.original.clerkId, 'admin')} disabled={processingUser[row.original.clerkId] === 'role' || row.original.clerkId === userId}>
                                    <RiAdminFill /> Make admin
                                </DropdownMenuItem>
                        }
                        <DropdownMenuItem onClick={() => setAdjustCoin({ clerkId: row.original.clerkId, email: row.getValue('email'), coin: row.getValue('coin') })} disabled={processingUser[row.original.clerkId] === 'coin'}><RiCoinFill /> Adjust coins</DropdownMenuItem>
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
                    { column.getIsSorted() === 'asc' ? <FaCaretUp /> : <FaCaretDown /> }
                </div>
            ),
            cell: ({ row }: { row: Row<userType> }) => (
                <div className="whitespace-nowrap">
                    { (row.getValue('createdAt') as Date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) }
                </div>
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

    async function updateUserRole(clerkId: string, role: string): Promise<void> {
        if (clerkId !== userId && !processingUser[clerkId]) {
            dispatch(addUserProcess({ clerkId, type: 'role' }));

            const updatedUser: updateRoleReturn = await updateRole(clerkId, role);
            if (updatedUser) {
                const { updatedClerkId, newRole }: { updatedClerkId: string, newRole: 'admin' | 'user' } = updatedUser;
                setUsers((users) => users.map((user) => user.clerkId === updatedClerkId ? { ...user, clerkId: updatedClerkId, role: newRole } : user));
            }

            dispatch(removeUserProcess(clerkId));
        }
    }

    return { setUsers, table, columnsLength: columns.length, adjustCoin, setAdjustCoin };
}
