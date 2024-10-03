import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: "unauthrozed: no token provided" });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    if(!decoded){
        res.status(401).json({message:"unauthorized token "})
    }

    const user = await User.findById(decoded.userId).select("-password")

    if(!user){
        res.status(404).json({message:"User not found!"})
    }

    req.user = user

    next()

  } catch (error) {
    console.log(`Error occured : ${error.message}`);
    res.status(500).json({message:"Server error"})
  }
};
