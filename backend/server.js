import express from 'express'
import dotenv from 'dotenv'
import connectMongoDB from './database/connect.database.js'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificatinRoutes from './routes/notification.rouutes.js'
dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const app = express()
const PORT = process.env.PORT||5000

app.use(express.json());// to parse req.body
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notifications",notificatinRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running at port :- http://localhost:3000`);
    connectMongoDB();
})