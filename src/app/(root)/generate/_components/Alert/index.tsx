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
                title={ <span>Just a moment{ dot }</span> }
                description={ <span>We&apos;re getting things ready for you</span> }
            />
        );
    } else if (status === 'done') {
        return (
            <AlertDialogContent
                title={ <span className="flex items-center gap-2"><MdOutlineCheckCircleOutline /> Success</span> }
                description={ <span>Your request has been received</span> }
                footer={ <Link href="/video"><Button>Go to video</Button></Link> }
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
