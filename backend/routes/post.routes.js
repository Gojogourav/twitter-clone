import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { createPostProvider, deletePostProvider } from '../controllers/post.controller.js'

const router = express.Router()

router.post("/create",protectRoute,createPostProvider)
// router.post("/comment/:id",protectRoute,createCommentProvider)
// router.post("/like/:id",protectRoute,likeUnlikePost)
router.delete("/:id",protectRoute,deletePostProvider)



export default router