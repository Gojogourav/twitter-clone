import User from "../models/user.model.js";
import Notification from "../models/notification.model.js"
export const getUserProfile = async(req,res)=>{
    const {username} = req.params
    if(!username){
        res.status(404).json({error:"User not found"})
    }
    try{
        const user = await User.findOne({username}).select("-password")
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        res.status(200).json(user)

    }catch(error){
        console.log(`Error occured in getUserProfile : ${error.message}`);
        res.status(500).json({error:error.message})
    }
}

export const followUnfollowProfile = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(404).json({error:"Unable to follow the user"})
        }   
        const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);



        if(!userToModify){
            return res.status(404).json({error:"User not found"})
        }

        if(id === (req.user._id).toString()){
            return res.status(400).json({error:"You cannot follow yourself"})
        }

        const isFollowing = currentUser.following.includes(id)

        if(isFollowing){
            //unfollow the user
            console.log(1);
            
            await User.findByIdAndUpdate(id,{$pull:{following:req.user._id}})
            console.log(2);
            
            await User.findByIdAndUpdate(req.user._id,{$pull:{followers:id}})
            console.log(3);
            
            return res.status(200).json({ message: "User unfollowed successfully" });
        }else{
            //follow
            console.log(1);
            
            await User.findByIdAndUpdate(id,{$push : {followers:req.user._id}})
            console.log(2);
            
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}})
            console.log(3);
            
            const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});

			await newNotification.save();

            return res.status(200).json({message:` followed you`})
            //send notification to the user that got followed
        }


    }catch(error){
        console.log(`Error occured in followUnfollowProfile : ${error.message}`);
        res.status(500).json({error:error.message})
    }
}