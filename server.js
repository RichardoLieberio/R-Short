import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { generate } from './controllers/generate.js';
import { render } from './controllers/render.js';
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

    const result = await generate({ userId, insertedId, style, duration, storyboard });

    if (result) {
        io.to(userId).emit('generate:success', { videoId: insertedId, ...result });
        const path = await render(userId, insertedId);
        if (path) io.to(userId).emit('generate:rendered', { videoId: insertedId, path });
    } else {
        io.to(userId).emit('generate:failed', { videoId: insertedId });
    }
});

app.patch('/', async (req, res) => {
    const { userId, videoId } = req.body;
    const path = await render(userId, videoId);

    if (path) {
        io.to(userId).emit('generate:rendered', { videoId, path });
        res.json({ path });
    }
});

app.delete('/', (req, res) => deleteVideo(req.body.folder, true));

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
