'use client';

import { Context, createContext, useContext, ReactNode, JSX, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from '@clerk/nextjs';
import { UseAuthReturn } from '@clerk/types';
import { getSocket } from '@lib/socket';

const SocketContext: Context<{ socket: Socket | null }> = createContext<{ socket: Socket | null }>({ socket: null });
export const useSocket: () => { socket: Socket | null } = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: ReactNode }): JSX.Element {
    const [ socket, setSocket ]: [ Socket | null, Dispatch<SetStateAction<Socket | null>> ] = useState<Socket | null>(null);
    const { isSignedIn, userId }: UseAuthReturn = useAuth();

    useEffect(() => {
        const socketInstance: Socket | null = getSocket(userId);
        if (socketInstance) setSocket(socketInstance);

        return (): void => {
            socketInstance?.disconnect();
        };
    }, [ isSignedIn, userId ]);

    return (
        <SocketContext.Provider value={{ socket }}>
            { children }
        </SocketContext.Provider>
    );
}
