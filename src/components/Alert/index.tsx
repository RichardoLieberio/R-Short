import { JSX, Dispatch, SetStateAction, ReactNode } from 'react';

import Link from 'next/link';
import { MdOutlineCheckCircleOutline, MdErrorOutline } from 'react-icons/md';
import { AlertDialogContent as ShadcnAlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@components/shadcn/alert-dialog';
import { Button } from '@components/shadcn/button';

import { useDots } from './hooks';

type AlertProps = {
    status: string;
    setStatus: Dispatch<SetStateAction<string>>;
    navigate: boolean;
};

export default function Alert({ status, setStatus, navigate }: AlertProps): JSX.Element {
    const dot: string = useDots();

    if (status === 'loading') {
        return (
            <AlertDialogContent
                title={ <span>Just a moment{ dot }</span> }
                description={ <span>We&apos;re getting things ready for you</span> }
            />
        );
    } else if (status === 'done') {
        return (
            <AlertDialogContent
                title={ <span className="flex items-center gap-2"><MdOutlineCheckCircleOutline /> Success</span> }
                description={ <span>Your request has been received</span> }
                footer={
                    navigate
                        ? <Link href="/video"><Button>Go to video</Button></Link>
                        : <Button onClick={() => setStatus('')}>Close</Button>
                }
            />
        );
    } else {
        return (
            <AlertDialogContent
                title={ <span className="flex items-center gap-2"><MdErrorOutline /> Oops</span> }
                description={ <span>{ status }</span> }
                footer={ <Button onClick={() => setStatus('')}>Close</Button> }
            />
        );
    }
}

type AlertDialogContentProps = {
    title: ReactNode;
    description: ReactNode;
    footer?: ReactNode;
};

function AlertDialogContent({ title, description, footer }: AlertDialogContentProps): JSX.Element {
    return (
        <ShadcnAlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{ title }</AlertDialogTitle>
                <AlertDialogDescription>{ description }</AlertDialogDescription>
            </AlertDialogHeader>
            {
                footer && <AlertDialogFooter>{ footer }</AlertDialogFooter>
            }
        </ShadcnAlertDialogContent>
    );
}
