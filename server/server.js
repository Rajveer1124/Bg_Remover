import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import connectDB from '../configs/mongoDb.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
await connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('API Working');
});

// Export the serverless handler
export const handler = serverless(app);

// (Optional) For local development
export default app;
