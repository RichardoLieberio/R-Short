import { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import formSchema from '@schema/formSchema';
import { useGenerateFormReturn } from './types';

export function useGenerateForm(): useGenerateFormReturn {
    const [ isSubmitting, setIsSubmitting ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    const form: UseFormReturn<z.infer<typeof formSchema>> = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
        if (!isSubmitting) {
            try {
                setIsSubmitting(true);
                const response: Response = await fetch('/api/generate-video', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
                const result: unknown = await response.json();
                console.log(result);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return { form, onSubmit };
}
