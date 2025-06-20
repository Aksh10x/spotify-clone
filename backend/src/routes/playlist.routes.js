import { Router } from "express";
import passport from "passport";
import { 
    addSongToPlaylist, 
    createPlaylist, 
    getPlaylist, 
    getUserPlaylists, 
    songExistsInPlaylist,
    deletePlaylist 
} from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.js";
import { cacheMiddleware, clearMultipleCache } from "../middlewares/cacheMiddleware.js";

const router = new Router();

router.route("/create").post(
    passport.authenticate("jwt", {session: false}),
    clearMultipleCache(["user-playlists", "playlists"]), 
    upload.single("thumbnail"),
    createPlaylist
);

router.route("/add-song-playlist").post(
    passport.authenticate("jwt", {session: false}),
    addSongToPlaylist
);

router.route("/delete-playlist/:playlistId").delete(
    passport.authenticate("jwt", {session: false}),
    clearMultipleCache(["user-playlists", "playlists", "playlist-detail"]), 
    deletePlaylist
);

router.route("/get-playlist/:playlistId").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("playlist-detail", 300),
    getPlaylist
);

router.route("/user-playlists/:userId").get(
    passport.authenticate("jwt", {session: false}),
    cacheMiddleware("user-playlists", 300),  
    getUserPlaylists
);

router.route("/song-exists-playlist").post(
    passport.authenticate("jwt", {session: false}),
    songExistsInPlaylist 
);

export default router;