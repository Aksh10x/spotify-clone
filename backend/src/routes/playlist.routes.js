import { Router } from "express";
import passport from "passport";
import { addSongToPlaylist, createPlaylist, getPlaylist } from "../controllers/playlist.controller.js";

const router = new Router()

router.route("/create").post(passport.authenticate("jwt", {session: false}), createPlaylist)

router.route("/get-playlist/:playlistId").get(passport.authenticate("jwt", {session: false}), getPlaylist)

router.route("/add-song-playlist").post(passport.authenticate("jwt", {session: false}), addSongToPlaylist)

router.route("get-user-playlists/:userId").post(passport.authenticate("jwt", {session: false}), createPlaylist)

export default router