import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();

import connectDB from './configs/mongodb.js';
const PORT = process.env.PORT || 4000;

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

app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
});
