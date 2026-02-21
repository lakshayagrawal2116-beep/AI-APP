import express from 'express';
import https from 'https';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()

await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Server is Live!'))

app.use(requireAuth())

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);

    // Self-ping system to avoid Render's free tier from sleeping
    const pingUrl = 'https://nexai-lxp5.onrender.com/';
    setInterval(() => {
        https.get(pingUrl, (res) => {
            if (res.statusCode === 200) {
                console.log(`Self-ping successful. Target awake: ${pingUrl}`);
            } else {
                console.log(`Self-ping failed with status: ${res.statusCode}`);
            }
        }).on('error', (err) => {
            console.error(`Self-ping error: ${err.message}`);
        });
    }, 14 * 60 * 1000); // 14 minutes
})