'use client';

import { JSX } from 'react';

import { useGenerateFormReturn } from './types';
import { useGenerateForm } from './hooks';

import Style from './_components/Style';
import Duration from './_components/Duration';
import Storyboard from './_components/StoryBoard';
import Alert from './_components/Alert';

import { Form } from '@components/shadcn/form';
import { Button } from '@components/shadcn/button';
import { AlertDialog } from '@components/shadcn/alert-dialog';

export const metadata: object = {
    title: 'R Short - AI Powered Short Video Generator',
    description: 'Create AI-powered short videos instantly. Enter your concept, and watch our AI transform it into a stunning video within seconds.',
};

export default function GeneratePage(): JSX.Element {
    const { status, setStatus, form, onSubmit }: useGenerateFormReturn = useGenerateForm();

    return (
        <div className="mt-12 md:mt-16 mb-16">
            <Form { ...form }>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8" autoCapitalize="off" autoComplete="off" spellCheck="false">
                    <Style form={form} />
                    <Duration form={form} />
                    <Storyboard form={form} />
                    <Button type="submit" disabled={!!status}>Submit</Button>
                </form>
            </Form>
            <AlertDialog open={!!status}>
                <Alert status={status} setStatus={setStatus} />
            </AlertDialog>
        </div>
    );
}
