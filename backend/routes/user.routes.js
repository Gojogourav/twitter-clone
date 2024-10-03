import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { followUnfollowProfile, getUserProfile } from '../controllers/user.controller.js'

const router = express.Router()

router.get("/profile/:username",protectRoute,getUserProfile)
// router.get("/suggest/:username",protectRoute,getUserProfile)
router.post("/follow/:id",protectRoute,followUnfollowProfile)
// router.post("/update/username",protectRoute,updateUserProfile)

export default router