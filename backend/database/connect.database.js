import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI;

const connectMongoDB = async()=>{
    try{
        const connection = await mongoose.connect(`${MONGODB_URI}`)
        console.log(`MongoDB connected : ${connection.connection.host}`);
        

    }catch(error){
        console.error(`Error connecting to mongoDB ${error.message}`);
        process.exit(1);
    }
}

export default connectMongoDB