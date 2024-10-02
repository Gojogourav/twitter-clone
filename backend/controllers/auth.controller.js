import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { type } from "os";
export const signup = async(req,res)=>{
    try{
        
        const {fullname,username,email,password} = req.body;
        if (!fullname || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email format"})
        }

        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({error:"User already exists"})
        }
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            
            return res.status(400).json({error:"Email already exists"})
        }
        

        if(typeof(password)!=='string'||password.trim().length < 6){
            return res.status(400).json({ error: "Invalid password" });

        }

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullname,
            username,
            email,
            password:hashPassword
        })

        
        await newUser.save();
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)

            res.status(201).json({
                _id:newUser._id,
                username:newUser.username,
                fullname:newUser.fullname,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                coverImg:newUser.coverImg,
                profileImg:newUser.profileImg,
                bio:newUser.bio,
                link:newUser.link,
            })
        }else{
            res.status(400).json({error:"Invalid user data"})
        }


    }catch(error){
        console.log(error.message);
            
        res.status(400).json({error:"internal server error"})
    }
}

export const login = async (req,res)=>{
    res.json({
        data:"you have hit the login endpoint",
    })
}

export const logout = async (req,res)=>{
    res.json({
        data:"you have hit the logout endpoint",
    })
}