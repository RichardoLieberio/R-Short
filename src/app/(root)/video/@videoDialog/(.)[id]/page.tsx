'use client';

import { JSX } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@components/shadcn/dialog';
import Video from '@components/Video';

export default function VideoDialog(): JSX.Element {
    const { id }: { id: string } = useParams();

    const isValidInteger: boolean = /^[1-9]\d*$/.test(id);
    if (!isValidInteger) notFound();

    const router: AppRouterInstance = useRouter();

    function closeDialog(open: boolean): void {
        if (!open) {
            router.back();
            setTimeout(() => history.pushState(null, '', window.location.href), 1);
        }
    }

    return (
        <Dialog open onOpenChange={closeDialog}>
            <DialogContent className="w-fit lg:max-w-none p-0 bg-transparent border-none lg:flex lg:gap-16">
                <DialogHeader hidden className="hidden">
                    <DialogTitle hidden>Video Dialog</DialogTitle>
                    <DialogDescription hidden>Video dialog</DialogDescription>
                </DialogHeader>
                <Video id={+id} />
            </DialogContent>
        </Dialog>
    );
}
