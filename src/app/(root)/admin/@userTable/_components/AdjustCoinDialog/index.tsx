'use client';

import { Dispatch, SetStateAction, JSX } from 'react';
import { z } from 'zod';
import { ControllerRenderProps } from 'react-hook-form';

import { useAdjustCoinDialog } from './hooks';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@components/shadcn/dialog';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@components/shadcn/form';
import { Input } from '@components/shadcn/input';
import { Button } from '@components/shadcn/button';

import coinSchema from '@schema/coinSchema';
import { useAdjustCoinDialogReturn } from './types';
import { userType } from '../../types';

type AdjustCoinDialogProps = {
    setUsers: Dispatch<SetStateAction<userType[]>>;
    adjustCoin: { clerkId: string, email: string, coin: number } | boolean;
    setAdjustCoin: Dispatch<SetStateAction<{ clerkId: string, email: string, coin: number } | boolean>>;
}

export default function AdjustCoinDialog({ setUsers, adjustCoin, setAdjustCoin }: AdjustCoinDialogProps): JSX.Element {
    const { form, onSubmit, processing }: useAdjustCoinDialogReturn = useAdjustCoinDialog(setUsers, adjustCoin, setAdjustCoin);

    return (
        <Dialog open={!!adjustCoin} onOpenChange={setAdjustCoin}>
            <DialogContent>
                <DialogHeader className="text-left">
                    <DialogTitle>Adjust coin</DialogTitle>
                    <DialogDescription>Modify the coin balance for { (adjustCoin as { email: string }).email }</DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form onSubmit={form.handleSubmit(onSubmit)} autoCapitalize="off" autoComplete="off" spellCheck="false">
                        <FormField control={form.control} name="coin" render={({ field }: { field: ControllerRenderProps<z.infer<typeof coinSchema>, 'coin'> }) => (
                            <FormItem>
                                <FormControl>
                                    <Input { ...field } onChange={(e) => field.onChange(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))} disabled={processing} type="number" min="0" className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter className="mt-4 flex-row justify-end space-x-2">
                            <Button onClick={() => setAdjustCoin(false)} variant="ghost">Close</Button>
                            <Button disabled={processing} type="submit">Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
