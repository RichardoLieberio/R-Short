import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { generate } from './controllers/generate.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URI,
        methods: [ 'GET', 'POST' ],
        allowedHeaders: [ 'Authorization' ],
        credentials: true
    },
});

io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    socket.id = userId;
    return next();
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('generate', async (data) => {
        const result = await generate({ ...data });
        if (result) socket.emit('generate:success', { videoId: data.insertedId });
        else socket.emit('generate:failed', { videoId: data.insertedId });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
