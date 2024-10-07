import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  if (!username) {
    res.status(404).json({ error: "User not found" });
  }
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error occured in getUserProfile : ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ error: "Unable to follow the user" });
    }
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify) {
      return res.status(404).json({ error: "User not found" });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const isFollowing = currentUser.following.includes(id);

    
    if (isFollowing) {
      //unfollow the user

      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id} });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id.toString() } });

      return res.status(200).json({ message: "User unfollowed successfully" });
    } 
    else {
      //follow

      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id.toString() } });

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();
      const user = await User.findById(req.user._id.toString())
      const username = user.username

      return res.status(200).json({ message: `${username} followed you` });
      //send notification to the user that got followed
    }
  } catch (error) {
    console.log(`Error occured in followUnfollowProfile : ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async(req,res)=>{
    try{
        const userId = req.user._id.toString()

        const usersFollowedByMe = await User.findById(userId).select("following")

        const suggestedUsers = await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId},
                    _id:{$nin:usersFollowedByMe.following}
                }
            },
            {
                $sample:{size:10}
            },
            {
                $project:{
                    password:0
                },
            },
            {
                $limit:4
            }
        ])


        res.status(200).json(suggestedUsers)
    }
    catch(error){
        console.log(`error in getSuggestedUsers controller : ${error.message}`);
        
        res.status(500).json({error: error.message})
    }
}

export const updateUser = async(req,res)=>{
    try{
        const {fullname,email,username,currentPassword,newPassword,bio,link} = req.body
        let {profileImg,coverImg} = req.body
        const userId = req.user._id

        
        let user = await User.findById(userId)
        if(!user) return res.status(404).json({message:"User not found!"})
        
        if((!currentPassword && currentPassword) || (!newPassword && currentPassword)) return res.status(400).json({message:"Please enter both passwords"})
        
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password)
            if(!isMatch) return res.status(400).json({message:"Incorrect password please try again"})
            if(newPassword.length<6){
                return res.status(400).json({message:"Password length cannot be less than 6 "})
            }

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword,salt)
        
        }

        if(profileImg){

            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url
        }

        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop(".")[0])

            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url
        }

        user.fullname = fullname || user.fullname
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = link ||user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg
    
        user = await user.save();

        user.password = null
        
        return res.status(200).json(user)
    }catch(error){
        console.log(`Error occured in updateUser collection : ${error.message}`);
        res.status(500).json({error: error.message})
    }
}