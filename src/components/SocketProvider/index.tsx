'use client';

import { createContext, useContext, ReactNode, JSX, Context } from 'react';
import { useSocketProvider } from './hooks';
import { Socket } from 'socket.io-client';

const SocketContext: Context<{ socket: Socket | null }> = createContext<{ socket: Socket | null }>({ socket: null });
export const useSocket: () => { socket: Socket | null } = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: ReactNode }): JSX.Element {
    const socket: Socket | null = useSocketProvider();

    return (
        <SocketContext.Provider value={{ socket }}>
            { children }
        </SocketContext.Provider>
    );
}
