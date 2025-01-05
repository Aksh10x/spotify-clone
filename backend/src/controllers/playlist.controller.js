import {Playlist} from "../models/playlist.model.js"
import { Song } from "../models/song.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"

const createPlaylist = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user
    const {name, thumbnail, songs} = req.body

    if(name.trim === ""){
        throw new ApiError(400,"Playlist name is required")
    }
    //can implement my playlist #number feature
    //no thumbnail then default thumbnail for playlist

    const playlistData = {
        name,
        thumbnail,
        songs,
        owner: currentUser._id
    }

    const playlist = await Playlist.create(playlistData)

    return res.status(200).json(
        new ApiResponse(200,playlist,"Playlist created successfully")
    )
})

const getPlaylist = asyncErrorHandler(async(req,res) => {
    const {playlistId} = req.params

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist does not exist, not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    )
})

const getUserPlaylists = asyncErrorHandler(async(req,res) => {
    const {userId} = req.params

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404,"User does not exist, not found")
    }

    const playlists = await Playlist.find({owner: userId})

    return res.status(200).json(
        new ApiResponse(200,playlists,"Playlists fetched successfully")
    )
})

const addSongToPlaylist = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user
    const {songId, playlistId} = req.body

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlist doesnt exist, not found")
    }

    if(playlist.owner.toString() != currentUser._id.toString() && 
    !playlist.collaborators.includes(currentUser._id)){
        throw new ApiError(401,"User does not own playlist")
    }

    const song = await Song.findById(songId)

    if(!song){
        throw new ApiError(404,"Song doesnt exist, not found")
    }

    playlist.songs.push(songId)

    await playlist.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(200, playlist, "Song added to playlist successfully")
    )
})

export {
    createPlaylist,
    getPlaylist,
    addSongToPlaylist,
    getUserPlaylists
}