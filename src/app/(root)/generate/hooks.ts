import { Dispatch, SetStateAction, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import formSchema from '@schema/formSchema';

import { AppDispatch, useAppDispatch } from '@store';
import { reduceCoin } from '@store/user';

import { useGenerateFormReturn } from './types';

export function useGenerateForm(): useGenerateFormReturn {
    const [ status, setStatus ]: [ string, Dispatch<SetStateAction<string>> ] = useState('');
    const dispatch: AppDispatch = useAppDispatch();

    const form: UseFormReturn<z.infer<typeof formSchema>> = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
        if (!status) {
            try {
                setStatus('loading');
                const response: Response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                if (response.status === 200) {
                    dispatch(reduceCoin());
                    setStatus('done');
                } else if (response.status === 403) {
                    setStatus('coin');
                } else if (response.status === 429) {
                    const { errors }: { errors: { style?: string[], duration?: string[], storyboard?: string[] } } = await response.json();
                    Object.entries(errors).forEach(([ key, message ]: [ string, string[] ]) => {
                        form.setError(key as keyof z.infer<typeof formSchema>, {
                            type: 'server',
                            message: message[0] || 'Invalid input',
                        });
                    });
                    setStatus('Please correct the highlighted fields before submitting the form');
                } else if (response.status === 400) {
                    const { message }: { message: string } = await response.json();
                    setStatus(message);
                }
            } catch (error) {
                console.error(error);
                setStatus('Something went wrong');
            }
        }
    }

    return { status, setStatus, form, onSubmit };
}
