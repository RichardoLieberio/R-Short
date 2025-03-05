import { JSX } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import { z } from 'zod';
import formSchema from '@schema/formSchema';

import { FormField, FormItem, FormLabel, FormMessage } from '@components/shadcn/form';
import { Card } from '@components/shadcn/card';

import { durations } from './data';

import { durationType } from './types';
import { formType } from '../../types';

export default function Duration({ form }: formType): JSX.Element {
    return (
        <FormField control={form.control} name="duration" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'duration'> }) => (
            <FormItem>
                <FormLabel>Duration</FormLabel>
                <div className="flex items-center gap-2">
                    {
                        durations.map(({ value, text }: durationType) => (
                            <Card key={text} onClick={() => field.onChange(value)} className={`${field.value === value && 'border-2 border-primary'} w-20 h-10 flex items-center justify-center cursor-pointer`}>
                                { text }
                            </Card>
                        ))
                    }
                </div>
                <FormMessage />
            </FormItem>
        )} />
    );
}
