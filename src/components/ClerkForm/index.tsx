import { ReactNode, JSX } from 'react';
import { ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import Skeleton from '@components/Skeleton';

export default function ClerkForm({ children }: { children: ReactNode }): JSX.Element {
    return (
        <>
            <ClerkLoading>
                <Skeleton className="w-full h-[300px] max-w-[400px] rounded-lg" containerClassName="flex-1 text-center" />
            </ClerkLoading>
            <ClerkLoaded>
                { children }
            </ClerkLoaded>
        </>
    );
}
