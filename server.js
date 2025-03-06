import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { generate } from './controllers/generate.js';
import { deleteVideo } from './controllers/deleteVideo.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URI,
        methods: [ 'POST' ],
        allowedHeaders: [ 'Authorization' ],
        credentials: true
    },
});

app.use(express.json());
app.use(express.static('temp'));

io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    socket.id = userId;
    return next();
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.post('/', async (req, res) => {
    const { userId, insertedId, style, duration, storyboard } = req.body;

    io.to(userId).emit('generate:pending', { videoId: insertedId });

    const path = await generate({ userId, insertedId, style, duration, storyboard });

    if (path) io.to(userId).emit('generate:success', { videoId: insertedId, path });
    else io.to(userId).emit('generate:failed', { videoId: insertedId });
});

app.delete('/', deleteVideo);

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
