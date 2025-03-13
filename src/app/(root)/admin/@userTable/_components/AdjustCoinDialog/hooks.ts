import { useEffect, Dispatch, SetStateAction } from 'react';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';

import { useAppSelector, useAppDispatch, AppDispatch } from '@store';
import { addUserProcess, removeUserProcess } from '@store/user';

import { updateCoin } from './action';
import coinSchema from '@schema/coinSchema';
import { updateCoinReturn, useAdjustCoinDialogReturn } from './types';
import { userType } from '../../types';

type adjustCoinType = boolean | { clerkId: string, email: string, coin: number };
type setUsersType = Dispatch<SetStateAction<userType[]>>;
type setAdjustCoinType = Dispatch<SetStateAction<{ clerkId: string, email: string, coin: number } | boolean>>

export function useAdjustCoinDialog(setUsers: setUsersType, adjustCoin: adjustCoinType, setAdjustCoin: setAdjustCoinType): useAdjustCoinDialogReturn {
    const processingUser: { [ email: string ]: string } = useAppSelector((state) => state.user.processingUser);
    const dispatch: AppDispatch = useAppDispatch();

    const form: UseFormReturn<z.infer<typeof coinSchema>> = useForm<z.infer<typeof coinSchema>>({
        resolver: zodResolver(coinSchema),
    });

    useEffect(() => {
        if (adjustCoin) form.reset({ coin: (adjustCoin as { coin: number }).coin });
    }, [ form, adjustCoin ]);

    async function onSubmit(values: z.infer<typeof coinSchema>): Promise<void> {
        if (!processingUser[(adjustCoin as { clerkId: string }).clerkId]) {
            dispatch(addUserProcess({ clerkId: (adjustCoin as { clerkId: string }).clerkId, type: 'coin' }));

            const result: updateCoinReturn | void = await updateCoin((adjustCoin as { clerkId: string }).clerkId, values.coin);

            if (result) {
                if ('errors' in result) {
                    Object.entries(result.errors).forEach(([ key, message ]: [ string, string[] | undefined ]) => {
                        if (message) form.setError(key as keyof z.infer<typeof coinSchema>, {
                            type: 'server',
                            message: message[0] || 'Invalid input',
                        });
                    });
                } else {
                    setUsers((users) => users.map((user) => user.clerkId === result.clerkId ? { ...user, coin: result.coin }: user));
                    setAdjustCoin((adjustCoin: adjustCoinType) => adjustCoin && (adjustCoin as { clerkId: string }).clerkId === result.clerkId ? false : adjustCoin);
                }
            }

            dispatch(removeUserProcess((adjustCoin as { clerkId: string }).clerkId));
        }
    }

    return { form, onSubmit, processing: adjustCoin ? !!processingUser[(adjustCoin as { clerkId: string }).clerkId] : false };
}
