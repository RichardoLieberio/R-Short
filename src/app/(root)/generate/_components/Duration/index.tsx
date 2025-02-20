import { JSX } from 'react';
import { z } from 'zod';
import { ControllerRenderProps } from 'react-hook-form';

import { formType } from '../../types';
import formSchema from '@schema/formSchema';

import { FormField, FormItem, FormLabel, FormMessage } from '@components/shadcn/form';
import { Card } from '@components/shadcn/card';

export default function Duration({ form }: formType): JSX.Element {
    const durations: { value: string, text: string }[] = [
        { value: '15', text: '15s' },
        { value: '30', text: '30s' },
        { value: '60', text: '60s' },
    ];

    return (
        <FormField control={form.control} name="duration" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'duration'> }) => (
            <FormItem>
                <FormLabel>Duration</FormLabel>
                <div className="flex items-center gap-2">
                    {
                        durations.map(({ value, text }: { value: string, text: string }) => (
                            <Card key={text} onClick={() => field.onChange(value)} className={`${field.value === value && 'border-2 border-primary'} w-20 h-10 flex items-center justify-center cursor-pointer`}>{text}</Card>
                        ))
                    }
                </div>
                <FormMessage />
            </FormItem>
        )} />
    );
}
