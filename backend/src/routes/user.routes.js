import Router from "express";
import { 
    Register,
    Login,
    checkMailUnique,
 } from "../controllers/user.controller.js";

const router = new Router()

router.route("/check-mail-unique").post(checkMailUnique)

router.route("/register").post(Register)

router.route("/login").post(Login)

export default router;