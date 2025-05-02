import { Router } from "express";
import { createSong, getMySongs, searchByArtist, searchByName, getOthersSongs } from "../controllers/song.controller.js";
import passport from "passport";
import { upload } from "../middlewares/multer.js";

const router = new Router()

router.route("/create").post(passport.authenticate("jwt", {session: false}),
upload.fields([
    {
        name: "thumbnail",
        maxCount: 1,
    },
    {
        name: "track",
        maxCount: 1
    }
]),
createSong)

router.route("/get-my-songs").get(passport.authenticate("jwt", {session: false}), getMySongs)

router.route("/search-song-name").post(passport.authenticate("jwt", {session: false}), searchByName)

router.route("/search-song-artist/:artistId").get(passport.authenticate("jwt", {session: false}), searchByArtist)

router.route("/get-others-songs/:userId").get(passport.authenticate("jwt", {session: false}), getOthersSongs)

export default router