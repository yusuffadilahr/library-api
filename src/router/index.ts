import { Router } from "express";
import authRoute from "./auth.router";
import memberRoute from "./member.router";
import transactionRouter from "./member.transaction.router";
import booksRouter from "./books.router";

const router = Router()
router.use('/auth', authRoute)
router.use('/member', memberRoute)
router.use('/transaction', transactionRouter)
router.use('/books', booksRouter)

export default router