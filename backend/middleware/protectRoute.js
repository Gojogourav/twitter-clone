import jsonwebtoken from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import User from "../models/user.model.js";
import dotenv from 'dotenv'
dotenv.config()


export const protectRoute = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        console.log(token);
        
        if(!token) return res.status(401).json({error:"unauthorized : no token provided"})
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({error:"Unauthorized invalid token"})
        }

        const user = await User.findById(decoded.userId).select("-password")
        
        if(!user){
            return res.status(404).json({error:"404 user not found"})
        }

        req.User = user;

        next()


    }catch(error){
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({error:"Internal server error"})
    }

}