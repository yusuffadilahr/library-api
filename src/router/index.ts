import { Router } from "express";
import authRoute from "./auth.router";
import memberRoute from "./member.router";

const router = Router()
router.use('/auth', authRoute)
router.use('/member', memberRoute)

export default router