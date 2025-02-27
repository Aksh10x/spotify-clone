import { Router } from "express";
import passport from "passport";
import { addSongToPlaylist, createPlaylist, getPlaylist, getUserPlaylists, songExistsInPlaylist } from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.js";

const router = new Router()

router.route("/create").post(passport.authenticate("jwt", {session: false}), upload.single("thumbnail"), createPlaylist)

router.route("/get-playlist/:playlistId").get(passport.authenticate("jwt", {session: false}), getPlaylist)

router.route("/add-song-playlist").post(passport.authenticate("jwt", {session: false}), addSongToPlaylist)

router.route("/user-playlists/:userId").get(passport.authenticate("jwt", {session: false}), getUserPlaylists)

router.route("/song-exists-playlist").post(passport.authenticate("jwt", {session: false}), songExistsInPlaylist)

export default router