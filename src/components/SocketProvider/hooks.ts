import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getSocket } from '@lib/socket';
import { Socket } from 'socket.io-client';
import { UseAuthReturn } from '@clerk/types';

export function useSocketProvider(): Socket | null {
    const [ socket, setSocket ]: [ Socket | null, Dispatch<SetStateAction<Socket | null>> ] = useState<Socket | null>(null);
    const { isSignedIn, userId }: UseAuthReturn = useAuth();

    useEffect(() => {
        const socketInstance: Socket | null = getSocket(userId);
        if (socketInstance) setSocket(socketInstance);

        return (): void => {
            socketInstance?.disconnect();
        };
    }, [ isSignedIn, userId ]);

    return socket;
}
