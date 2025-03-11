'use client';

import { useEffect, ReactNode, JSX } from 'react';
import { useAuth } from '@clerk/nextjs';
import { UseAuthReturn } from '@clerk/types';
import { backgroundRender } from './action';

export default function VideoRenderer({ children }: { children: ReactNode }): JSX.Element {
    const { userId, isSignedIn }: UseAuthReturn = useAuth();

    useEffect(() => {
        if (userId && isSignedIn) backgroundRender(userId);
    }, [ userId, isSignedIn ]);

    return (
        <>{ children }</>
    );
}
