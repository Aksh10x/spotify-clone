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
    Search,
    getOtherUserDetails
} from "../controllers/user.controller.js";
import passport from "passport";
import { upload } from "../middlewares/multer.js";
import { cacheMiddleware, clearMultipleCache } from "../middlewares/cacheMiddleware.js";

const router = new Router();

router.route("/check-mail-unique").post(checkMailUnique);
router.route("/register").post(Register);
router.route("/login").post(Login);

router.route("/toggle-artist").patch(
    passport.authenticate("jwt", {session: false}),
    clearMultipleCache(["user", "user-profile", "random-artists"]), 
    ToggleArtist
);

router.route("/become-artist").post(
    passport.authenticate("jwt", {session: false}),
    clearMultipleCache(["user", "user-profile", "random-artists"]),
    upload.single("avatar"),
    becomeArtist
);

router.route("/edit-details").post(
    passport.authenticate("jwt", {session: false}),
    clearMultipleCache(["user", "user-profile", "other-user"]), 
    upload.single("avatar"),
    editUserDetails
);

router.route("/get-user").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("user-profile", 300), 
    getUserDetails
);

router.route("/get-random-artists").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("random-artists", 1800),  
    getRandomArtists
);

router.route("/search").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("search-results", 300),
    Search
);

router.route("/get-other-user/:userId").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("other-user", 600), 
    getOtherUserDetails
);

export default router;