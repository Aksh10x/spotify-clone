import { Router } from "express";
import { createSong, getMySongs, searchByArtist, searchByName, getOthersSongs, whosTheArtist } from "../controllers/song.controller.js";
import passport from "passport";
import { upload } from "../middlewares/multer.js";
import { cacheMiddleware, clearMultipleCache } from "../middlewares/cacheMiddleware.js";

const router = new Router();

router.route("/create").post(
    passport.authenticate("jwt", {session: false}),
    clearMultipleCache(["songs", "user-songs", "artist-songs", "user-public-songs"]),
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "track", maxCount: 1 }
    ]),
    createSong
);

router.route("/get-my-songs").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("user-songs", 300),
    getMySongs
);

router.route("/search-song-name").post(
    passport.authenticate("jwt", {session: false}),
    searchByName 
);

router.route("/search-song-artist/:artistId").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("artist-songs", 1800),
    searchByArtist
);

router.route("/get-others-songs/:userId").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("user-public-songs", 600), 
    getOthersSongs
);

router.route("/whos-the-artist/:songId").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("song-artist", 3600),
    whosTheArtist
);

export default router;