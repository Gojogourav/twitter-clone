import express from 'express'
import dotenv from 'dotenv'
import connectMongoDB from './database/connect.database.js'
import cookieParser from 'cookie-parser'


import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT||5000

app.use(express.json());// to parse req.body
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running at port :- http://localhost:3000`);
    connectMongoDB();
})