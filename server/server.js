import express from 'express';
import cors from 'cors';
import dotenv from  'dotenv'
dotenv.config()
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;

const app = express();

// Initialise Middleware
app.use(express.json());
app.use(cors());

// Connect DB
await connectDB();

// API Routes
app.get('/', (req, res) => {
    res.send('API Working');
});
app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)

app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
});
