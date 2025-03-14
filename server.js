import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { generate } from './controllers/generate.js';
import { render } from './controllers/render.js';
import { deleteVideo } from './controllers/deleteVideo.js';

const queue = [];
let isRendering = false;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URI,
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

app.post('/', (req, res) => {
    console.log('Post request accepted');
    startGenerate(req.body || {});
    res.status(200).json({ message: 'Post request accepted' });
});

app.patch('/', (req, res) => {
    console.log('Patch request accepted');

    const { userId, videoId } = req.body || {};
    if (userId && videoId) {
        queue.push({ userId, videoId });
        addQueue();
    }

    res.status(200).json({ message: 'Patch request accepted' });
});

app.delete('/', (req, res) => {
    console.log('Delete request accepted');
    deleteVideo(req.body?.path, req.body?.folder)
    res.status(200).json({ message: 'Delete request accepted' });
});

app.patch('/coin', (req, res) => {
    console.log('Patch /coin request accepted');
    const { clerkId, coin } = req.body || {};
    if (clerkId && !isNaN(Number(coin))) io.to(clerkId).emit('coin:update', { coin });
    res.status(200).json({ message: 'Patch /coin request accepted' });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

async function startGenerate(body) {
    try {
        const { userId, insertedId, style, duration, storyboard } = body;
        if (!userId || !insertedId || !style || !duration || !storyboard) throw new Error('Incorrect body');

        io.to(userId).emit('generate:pending', { videoId: insertedId });

        const result = await generate({ userId, insertedId, style, duration, storyboard });

        if (result) {
            io.to(userId).emit('generate:success', { videoId: insertedId, ...result });

            queue.push({ userId, videoId: insertedId });
            addQueue();
        } else {
            io.to(userId).emit('generate:failed', { videoId: insertedId });
        }
    } catch (error) {
        console.error(error);
    }
}

async function addQueue() {
    if (isRendering) return;

    isRendering = true;
    const { userId, videoId } = queue.shift();

    console.log(`Rendering video. Video Id: ${videoId}`);
    const path = await render(userId, videoId);
    if (path) {
        io.to(userId).emit('generate:rendered', { videoId, path });
        console.log(`Video rendered. Video Id: ${videoId}`);
    }

    isRendering = false;
    if (queue.length) addQueue();
}
