import { Router } from "express";
import { loginAdmin } from "../controller/auth.controller";
import { userValidation } from "../middleware/user.validation";

const authRoute = Router()

authRoute.post('/login', userValidation, loginAdmin)

export default authRoute