import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import coinSchema from '@schema/coinSchema';

export type useAdjustCoinDialogReturn = {
    form: UseFormReturn<z.infer<typeof coinSchema>>,
    onSubmit: (values: z.infer<typeof coinSchema>) => Promise<void>;
    processing: boolean;
};

export type updateCoinReturn = {
    errors: {
        [x: string]: string[] | undefined;
        [x: number]: string[] | undefined;
        [x: symbol]: string[] | undefined;
    };
} | {
    clerkId: string;
    coin: number;
};
