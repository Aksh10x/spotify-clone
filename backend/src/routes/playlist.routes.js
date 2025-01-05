import { Router } from "express";
import passport from "passport";
import { createPlaylist, getPlaylist } from "../controllers/playlist.controller.js";

const router = new Router()

router.route("create").post(passport.authenticate("jwt", {session: false}), createPlaylist)

router.route("get-playlist/:playlistId").post(passport.authenticate("jwt", {session: false}), getPlaylist)

export default router