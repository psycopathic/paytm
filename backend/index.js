import express from 'express';
import cors from 'cors';
import { connectDB } from './src/lib/db.js';
import dotenv from 'dotenv';
import userRouter from './src/routes/userRoutes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1',userRouter)

app.get('/',(req,rea)=>{
    rea.send("hello")
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
    connectDB();
});