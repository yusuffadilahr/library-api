import { Router } from "express";
import { createMember, getMember } from "../controller/member.controller";

const memberRoute = Router()

memberRoute.post('/', createMember)
memberRoute.get('/', getMember)

export default memberRoute