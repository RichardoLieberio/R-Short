'use client';

import { JSX } from 'react';

import { useGenerateFormReturn } from './types';
import { useGenerateForm } from './hooks';

import Style from './_components/Style';
import CustomStyle from './_components/CustomStyle';
import Duration from './_components/Duration';
import Storyboard from './_components/StoryBoard';

import { Form } from '@components/shadcn/form';
import { Button } from '@components/shadcn/button';

export default function GeneratePage(): JSX.Element {
    const { customStyle, setCustomStyle, form, onSubmit }: useGenerateFormReturn = useGenerateForm();

    return (
        <div className="mt-12 md:mt-16 mb-16">
            <Form { ...form }>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8" autoCapitalize="off" autoComplete="off" spellCheck="false">
                    <Style customStyle={customStyle} setCustomStyle={setCustomStyle} form={form} />
                    {customStyle && <CustomStyle form={form} />}
                    <Duration form={form} />
                    <Storyboard form={form} />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
