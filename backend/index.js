import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRouter from './routes/authRoute.js'


const port = process.env.PORT || 5555
dotenv.config()

const app = express()
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.send('Server is running  🚀');
})
app.use("/api/auth", authRouter);

connectDB();
app.listen(port, ()=>
 console.log(`✅ Server running at http://localhost:${port}`)
);