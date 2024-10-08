import mongoose from "mongoose";
import { type } from "os";
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        },
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    
    profileImg:{
        type:String,
        default:"",

    },
    coverImg:{
        type:String,
        default:''
    },
    bio:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    },
    likedPosts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        default:[]
    }

},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User;