import { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import formSchema from '@schema/formSchema';

export type GenerateHooksReturn = {
    customStyle: boolean;
    setCustomStyle: Dispatch<SetStateAction<boolean>>;
    categories: { style: string, text: string, image: string }[];
    form: UseFormReturn<z.infer<typeof formSchema>>;
    onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
};

export default function useGenerateHooks(): GenerateHooksReturn {
    const [ isSubmitting, setIsSubmitting ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);
    const [ customStyle, setCustomStyle ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    const categories: { style: string, text: string, image: string }[] = [
        { style: '', text: 'Custom', image: '' },
        { style: 'cartoon', text: 'Cartoon', image: '/Cartoon.png' },
        { style: 'realistic', text: 'Realistic', image: '/Realistic.png' },
        { style: 'fantasy', text: 'Fantasy', image: '/Fantasy.png' },
        { style: 'watercolor', text: 'Watercolor', image: '/Watercolor.png' },
        { style: 'cyberpunk', text: 'Cyberpunk', image: '/Cyberpunk.png' },
        { style: 'pop art', text: 'Pop Art', image: '/Pop Art.png' },
        { style: 'gothic', text: 'Gothic', image: '/Gothic.png' },
        { style: 'minimalism', text: 'Minimalism', image: '/Minimalism.png' },
        { style: 'surrealism', text: 'Surrealism', image: '/Surrealism.png' },
        { style: 'impressionism', text: 'Impressionism', image: '/Impressionism.png' },
    ];

    const form: UseFormReturn<z.infer<typeof formSchema>> = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            storyboard: '',
            style: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
        if (!isSubmitting) {
            try {
                console.log(values);
                setIsSubmitting(true);
                const response: Response = await fetch('/api/generate-video', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        storyboard: 'A man who frequently lies finds himself in need of help, but no one believes him.',
                        style: 'custom',
                        customStyle: 'pixel art',
                    }),
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

    return { customStyle, setCustomStyle, categories, form, onSubmit };
}
