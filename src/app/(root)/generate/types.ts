import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import formSchema from '@schema/formSchema';

export type useGenerateFormReturn = {
    customStyle: boolean;
    setCustomStyle: Dispatch<SetStateAction<boolean>>;
    form: UseFormReturn<z.infer<typeof formSchema>>;
    onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
};

export type formType = {
    form: UseFormReturn<z.infer<typeof formSchema>>;
};

export type StyleProps = {
    customStyle: boolean;
    setCustomStyle: Dispatch<SetStateAction<boolean>>;
    form: UseFormReturn<z.infer<typeof formSchema>>;
};
