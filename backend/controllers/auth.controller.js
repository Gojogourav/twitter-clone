import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { type } from "os";
import { error } from "console";
export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (typeof password !== "string" || password.trim().length < 6) {
      return res.status(400).json({ error: "Invalid password , password size should be atleast 6" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        coverImg: newUser.coverImg,
        profileImg: newUser.profileImg,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log(error.message);

    res.status(400).json({ error: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`username : ${username} password : ${password}`);
    
    const user = await User.findOne({username});
    
    if(!user){
      return res.status(400).json({error:"User not found"})
    }
    
    const passwordCheck = await bcrypt.compare(password,user?.password || "" )
    
    if(!user){
        return res.status(400).json({error:"invalid username or password 1"})
    }
    if(!passwordCheck){
        return res.status(400).json({error:"invalid username or password 2"})
    }

    console.log(user);
    

    generateTokenAndSetCookie(user._id,res);

    res.status(200).json({
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        followers: user.followers,
        following: user.following,
        coverImg: user.coverImg,
        profileImg: user.profileImg,
        bio: user.bio,
        link: user.link,
    })

  } catch (error) {
    console.log(`Error in login controller ${error.message}`);
    res.status(500).json({ error: "internal server error" });
  }
};

export const logout = async (req, res) => {
  try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"logout successfully"})
  }catch(error){
    console.log("Error in logout controller ",error.message)
  }
};


export const getMe = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("-password")

        if(!user){
          return res.status(404).json({message:"User not found 404"})
        }

        res.status(200).json(user)
      }
    catch(error){
        console.log(`Error in getMe controller`,error.message);
        res.status(400).json({message:"User not found"})
    }
}