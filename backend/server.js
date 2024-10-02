import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import connectMongoDB from './database/connect.database.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT||5000
app.use(express.json());// to parse req.body
app.use("/api/auth",authRoutes);
app.use(express.urlencoded({extended:true}))

app.listen(PORT,()=>{
    console.log(`Server is running at port :- https://localhost:3000`);
    connectMongoDB();
})