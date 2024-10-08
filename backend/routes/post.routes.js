import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { createCommentProvider, createPostProvider, deletePostProvider, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePOstProvider } from '../controllers/post.controller.js'

const router = express.Router()

router.get("/all",protectRoute,getAllPosts)
router.get("/following",protectRoute,getFollowingPosts)
router.get("/likes/:id",protectRoute,getLikedPosts)
router.post("/create",protectRoute,createPostProvider)
router.post("/comment/:id",protectRoute,createCommentProvider)
router.post("/like/:id",protectRoute,likeUnlikePOstProvider)
router.delete("/:id",protectRoute,deletePostProvider)
router.get("/user/:username",protectRoute,getUserPosts)


export default router