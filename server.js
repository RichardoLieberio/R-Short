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

app.post('/', async (req, res) => {
    const { userId, insertedId, style, duration, storyboard } = req.body;

    io.to(userId).emit('generate:pending', { videoId: insertedId });

    const result = await generate({ userId, insertedId, style, duration, storyboard });

    if (result) {
        io.to(userId).emit('generate:success', { videoId: insertedId, ...result });

        queue.push({ userId, videoId: insertedId });
        addQueue();
    } else {
        io.to(userId).emit('generate:failed', { videoId: insertedId });
    }
});

app.patch('/', (req, res) => {
    const { userId, videoId } = req.body;
    queue.push({ userId, videoId });
    addQueue();
});

app.delete('/', (req, res) => deleteVideo(req.body.path, req.body.folder));

app.patch('/coin', (req, res) => {
    const { clerkId, coin } = req.body;
    io.to(clerkId).emit('coin:update', { coin });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

async function addQueue() {
    if (isRendering) return;

    isRendering = true;
    const { userId, videoId } = queue.shift();

    console.log(`Rendering video. Video Id: ${videoId}`);
    const path = await render(userId, videoId);
    if (path) {
        io.to(userId).emit('generate:rendered', { videoId, path });
        console.log(`Video rendered. Video Id: ${videoId}`);
    } else {
        console.log(`Video is rendered. Video Id: ${videoId}`);
    }

    isRendering = false;
    if (queue.length) addQueue();
}
