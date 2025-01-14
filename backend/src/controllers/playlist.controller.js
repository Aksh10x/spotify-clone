import mongoose from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import { Song } from "../models/song.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createPlaylist = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user
    const {name, description} = req.body
    const thumbnailLocalPath = req.file?.path || ""
    
    if(name.trim() === ""){
        throw new ApiError(400,"Playlist name is required")
    }
    //can implement my playlist #number feature
    //no thumbnail then default thumbnail for playlist

    if(thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if(!thumbnail){
            throw new ApiError(500,"Server error, could not upload image")
        }

        const playlistData = {
            name,
            thumbnail: thumbnail.url,
            description,
            owner: currentUser._id
        }

    
        const playlist = await Playlist.create(playlistData)
    
        return res.status(200).json(
            new ApiResponse(200,playlist,"Playlist created successfully")
        )
    }

    const playlistData = {
        name,
        description,
        owner: currentUser._id,
        thumbnail: "",
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
    console.log("hello")
    const {userId} = req.params

    console.log(userId)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId))

    console.log(user)

    if(!user){
        throw new ApiError(404,"User does not exist, not found")
    }

    const playlists = await Playlist.find({owner: userId})

    const playlistsToSend = playlists.map((p) => {
        return {
        name: p.name,
        description: p.description,
        thumbnail: p.thumbnail,    
        owner: user.firstName + user.secondName
        }
    })

    return res.status(200).json(
        new ApiResponse(200,playlistsToSend,"Playlists fetched successfully")
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