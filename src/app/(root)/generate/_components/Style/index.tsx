import Image from 'next/image';
import { JSX, Dispatch, SetStateAction, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import { z } from 'zod';
import formSchema from '@schema/formSchema';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/shadcn/form';
import { Carousel, CarouselContent, CarouselItem } from '@components/shadcn/carousel';
import { Card } from '@components/shadcn/card';
import { Input } from '@components/shadcn/input';

import { categories } from './data';

import { categoryType } from './types';
import { formType } from '../../types';

export default function Style({ form }: formType): JSX.Element {
    const [ customStyle, setCustomStyle ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    return (
        <FormField control={form.control} name="style" render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'style'> }) => (
            <FormItem>
                <FormLabel>Choose a style</FormLabel>
                <Carousel opts={{ align: 'center' }}>
                    <CarouselContent>
                        {
                            categories.map(({ style, text, image }: categoryType) => (
                                <CarouselItem key={text} className="w-32">
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
                                                    <span className="w-full h-10 absolute bottom-0 flex items-center justify-center bg-card">{ text }</span>
                                                </>
                                                : <span>{ text }</span>
                                        }
                                    </Card>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                </Carousel>
                {
                    customStyle && <FormControl className="!mt-8">
                        <Input { ...field } className="text-sm md:text-base" placeholder="Write your custom style..." />
                    </FormControl>
                }
                <FormMessage />
            </FormItem>
        )} />
    );
}
