'use client';

import { JSX } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn, ControllerRenderProps } from 'react-hook-form';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/shadcn/form';
import { Input } from '@components/shadcn/input';
import { Textarea } from '@components/shadcn/textarea';
import { Button } from '@components/shadcn/button';

type formSchemaType = {
    storyboard: string;
    style: string;
    customStyle?: string;
    voice: 'male' | 'female' | 'neutral';
    script?: string;
};

export default function GeneratePage(): JSX.Element {
    const formSchema: z.ZodSchema<formSchemaType> = z.object({
        storyboard: z.string()
            .min(20, { message: 'Storyboard must be at least 20 characters.' })
            .max(255, { message: 'Storyboard cannot exceed 255 characters.' }),
        style: z.string()
            .min(3, { message: 'Style must be at least 3 characters long.' })
            .max(30, { message: 'Style cannot exceed 30 characters.' }),
        customStyle: z.string()
            .min(3, { message: 'Style must be at least 3 characters long.' })
            .max(30, { message: 'Style cannot exceed 30 characters.' }),
        voice: z.enum([ 'male', 'female', 'neutral' ], {
            message: 'Please select a valid voice type: male, female, or neutral.',
        }),
        script: z.string()
            .min(100, { message: 'Script must be at least 100 characters long.' })
            .max(1000, { message: 'Script cannot exceed 1000 characters.' })
            .optional(),
    });

    const form: UseFormReturn<z.infer<typeof formSchema>> = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            storyboard: '',
            style: '',
            customStyle: '',
            voice: 'neutral',
            script: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>): void {
        console.log(values);
    }

    const categories: string[] = [ 'action', 'comedy', 'drama', 'sci-fi', 'horror', 'custom' ];

    return (
        <div className="mt-12 md:mt-16">
            <Form { ...form }>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                    <FormField control={form.control} name="style" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'style'> }) => (
                        <FormItem>
                            <FormLabel>Choose a style</FormLabel>
                            <div className="flex overflow-x-auto gap-2 p-2 scrollbar-hide">
                                {categories.map((type) => (
                                    <Button
                                        key={type}
                                        variant={field.value === type ? 'default' : 'outline'}
                                        className="whitespace-nowrap px-4 py-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            field.onChange(type);
                                        }}
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {
                        form.watch('style') === 'custom' && (
                            <FormField control={form.control} name="customStyle" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'customStyle'> }) => (
                                <FormItem>
                                    <FormLabel>Enter custom style</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )
                    }
                    <FormField control={form.control} name="storyboard" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'storyboard'> }) => (
                        <FormItem>
                            <FormLabel>Storyboard</FormLabel>
                            <FormControl>
                                <Textarea { ...field } />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button>Submit</Button>
                </form>
            </Form>
        </div>
    );
}
