import Router from "express";
import { 
    Register,
    Login,
    checkMailUnique,
    getUserDetails,
    ToggleArtist,
    changeAvatar,
 } from "../controllers/user.controller.js";
import passport from "passport";

const router = new Router()

router.route("/check-mail-unique").post(checkMailUnique)

router.route("/register").post(Register)

router.route("/login").post(Login)

router.route("/get-user").get(passport.authenticate("jwt", {session: false}), getUserDetails)

router.route("/toggle-artist").patch(passport.authenticate("jwt", {session: false}), ToggleArtist)

router.route("/change-avtar").patch(passport.authenticate("jwt",{session: false}), changeAvatar)

export default router;