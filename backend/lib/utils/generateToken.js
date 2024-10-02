import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const securekey = process.env.JWT_SECRET;

export const generateTokenAndSetCookie = (userId,res)=>{
    const token = jwt.sign({userId},securekey,{
        expiresIn:'15d'
    })

    res.cookie("jwt",token,{
        maxAge:15*24*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !=="development"
    })
}