import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(userId: string | null | undefined): Socket | null {
    if (!socket && userId) {
        socket = io(process.env.NEXT_PUBLIC_SERVICE_URI!, { transports: [ 'websocket' ], auth: { userId } });

        socket.on('connect', () => {
            console.log('Connected to socket service:', socket!.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket service');
        });
    }

    return socket;
}
