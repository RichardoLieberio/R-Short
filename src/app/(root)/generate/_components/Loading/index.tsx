
import Link from 'next/link';
import { Dispatch, SetStateAction, JSX } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@components/shadcn/alert-dialog';
import { Button } from '@components/shadcn/button';
import { MdOutlineCheckCircleOutline, MdErrorOutline } from 'react-icons/md';
import { useDots } from './hooks';

export default function Loading({ status, setStatus }: { status: string, setStatus: Dispatch<SetStateAction<string>> }): JSX.Element {
    const dot: string = useDots();

    return (
        <AlertDialog open={!!status}>
            <AlertDialogContent>
                {
                    status === 'loading' && <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">Generating{dot}</AlertDialogTitle>
                        <AlertDialogDescription>Creating your content, this won&apos;t take long</AlertDialogDescription>
                    </AlertDialogHeader>
                }
                {
                    status === 'done' && <>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2"><MdOutlineCheckCircleOutline /> Success</AlertDialogTitle>
                            <AlertDialogDescription>Your content has been generated</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Link href="/dashboard">
                                <Button>Go to dashboard</Button>
                            </Link>
                        </AlertDialogFooter>
                    </>
                }
                {
                    status === 'error' && <>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2"><MdErrorOutline /> Oops</AlertDialogTitle>
                            <AlertDialogDescription>Something went wrong</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button onClick={() => setStatus('')}>Close</Button>
                        </AlertDialogFooter>
                    </>
                }
            </AlertDialogContent>
        </AlertDialog>
    );
}
