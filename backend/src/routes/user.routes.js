import Router from "express";
import { 
    Register,
    Login,
    checkMailUnique,
    getUserDetails,
    ToggleArtist,
    becomeArtist,
    editUserDetails,
    getRandomArtists,
    Search
    
 } from "../controllers/user.controller.js";
import passport from "passport";
import { upload } from "../middlewares/multer.js";

const router = new Router()

router.route("/check-mail-unique").post(checkMailUnique)

router.route("/register").post(Register)

router.route("/login").post(Login)

router.route("/get-user").get(passport.authenticate("jwt", {session: false}), getUserDetails)

router.route("/toggle-artist").patch(passport.authenticate("jwt", {session: false}), ToggleArtist)

router.route("/become-artist").post(passport.authenticate("jwt",{session: false}),upload.single("avatar"), becomeArtist)

router.route("/edit-details").post(passport.authenticate("jwt",{session: false}), upload.single("avatar"), editUserDetails)

router.route("/get-random-artists").get(passport.authenticate("jwt",{session: false}), getRandomArtists)

router.route("/search").get(passport.authenticate("jwt",{session: false}), Search)

export default router;