'use client';

import Image from 'next/image';
import { JSX } from 'react';
import { z } from 'zod';
import { ControllerRenderProps } from 'react-hook-form';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/shadcn/form';
import { Carousel, CarouselContent, CarouselItem } from '@components/shadcn/carousel';
import { Card } from '@components/shadcn/card';
import { Input } from '@components/shadcn/input';
import { Textarea } from '@components/shadcn/textarea';
import { Button } from '@components/shadcn/button';

import formSchema from '@schema/formSchema';

import useGenerateHooks, { GenerateHooksReturn } from './hooks';

export default function GeneratePage(): JSX.Element {
    const { customStyle, setCustomStyle, categories, form, onSubmit }: GenerateHooksReturn = useGenerateHooks();

    return (
        <div className="mt-12 md:mt-16">
            <Form { ...form }>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                    <FormField control={form.control} name="style" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'style'> }) => (
                        <FormItem>
                            <FormLabel>Choose a style</FormLabel>
                            <Carousel opts={{ align: 'start' }} className="w-72 min-[480px]:w-[448px] md:w-[608px] mx-auto">
                                <CarouselContent>
                                    {
                                        categories.map(({ style, text, image }: { style: string, text: string, image: string }) => (
                                            <CarouselItem key={text} className="basis-1/2 min-[480px]:basis-1/3 md:basis-1/4 w-32 h-48">
                                                <Card
                                                    onClick={() => {
                                                        if (style) {
                                                            setCustomStyle(false);
                                                            field.onChange(style);
                                                        } else {
                                                            setCustomStyle(true);
                                                            field.onChange('');
                                                        }
                                                    }}
                                                    className={`${((customStyle && !style) || (!customStyle && field.value === style)) && 'border-2 border-primary'} w-full h-full relative flex flex-col items-center justify-center cursor-pointer overflow-hidden`}
                                                >
                                                    {
                                                        image
                                                            ? <>
                                                                <Image src={image} alt={text} quality={20} width="80" height="120" className="w-full" />
                                                                <span className="w-full py-2 absolute bottom-0 text-center bg-card">{text}</span>
                                                            </>
                                                            : <span>{text}</span>
                                                    }
                                                </Card>
                                            </CarouselItem>
                                        ))
                                    }
                                </CarouselContent>
                            </Carousel>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {
                        customStyle && (
                            <FormField control={form.control} name="style" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'style'> }) => (
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
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
