import { JSX } from 'react';
import { z } from 'zod';
import { ControllerRenderProps } from 'react-hook-form';

import { formType } from '../../types';
import formSchema from '@schema/formSchema';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/shadcn/form';
import { Input } from '@components/shadcn/input';

export default function CustomSyle({ form }: formType): JSX.Element {
    return (
        <FormField control={form.control} name="style" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'style'> }) => (
            <FormItem>
                <FormLabel>Custom style</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
    );
}
