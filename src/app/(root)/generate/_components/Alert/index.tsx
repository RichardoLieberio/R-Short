import { Dispatch, SetStateAction, JSX } from 'react';
import { useDots } from './hooks';
import Link from 'next/link';
import { Button } from '@components/shadcn/button';
import AlertDialogContent from '@components/AlertDialogContent';
import { MdOutlineCheckCircleOutline, MdErrorOutline } from 'react-icons/md';

export default function Alert({ status, setStatus }: { status: string, setStatus: Dispatch<SetStateAction<string>> }): JSX.Element {
    const dot: string = useDots();

    if (status === 'loading') {
        return (
            <AlertDialogContent
                title={ <span>Generating{ dot }</span> }
                description={ <span>Creating your content, this won&apos;t take long</span> }
            />
        );
    } else if (status === 'done') {
        return (
            <AlertDialogContent
                title={ <span className="flex items-center gap-2"><MdOutlineCheckCircleOutline /> Success</span> }
                description={ <span>Your content has been generated</span> }
                footer={ <Link href="/dashboard"><Button>Go to dashboard</Button></Link> }
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
