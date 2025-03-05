import { JSX } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import { z } from 'zod';
import formSchema from '@schema/formSchema';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/shadcn/form';
import { Textarea } from '@components/shadcn/textarea';

import { formType } from '../../types';

export default function Storyboard({ form }: formType): JSX.Element {
    return (
        <FormField control={form.control} name="storyboard" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'storyboard'> }) => (
            <FormItem>
                <FormLabel>Storyboard</FormLabel>
                <FormControl>
                    <Textarea { ...field } className="text-sm md:text-base" placeholder="Write your storyboard..." />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
    );
}
