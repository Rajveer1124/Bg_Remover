import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/mogoDb.js'
const corsConfig = {
    origin:"*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
//App Config
const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();

// Initialise Middleware
app.use(express.json());
app.use(cors(corsConfig));

// API Routes
app.get('/',(req,res)=>res.send("API Working"))

app.listen(PORT,()=>{
    console.log("Server Running on Port :"+ PORT)
})