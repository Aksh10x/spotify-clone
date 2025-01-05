import { Router } from "express";
import { createSong, getMySongs, searchByArtist, searchByName } from "../controllers/song.controller.js";
import passport from "passport";

const router = new Router()

router.route("/create").post(passport.authenticate("jwt", {session: false}),createSong)

router.route("/get-my-songs").get(passport.authenticate("jwt", {session: false}), getMySongs)

router.route("/search-song-name").post(passport.authenticate("jwt", {session: false}), searchByName)

router.route("/search-song-artist/:artistId").get(passport.authenticate("jwt", {session: false}), searchByArtist)

export default router