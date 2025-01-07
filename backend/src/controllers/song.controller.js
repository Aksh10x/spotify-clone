import {User} from "../models/user.model.js";
import {Song} from "../models/song.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const createSong = asyncErrorHandler(async(req,res) => {
    
    const currentUser = req.user

    if(!currentUser.isArtist){
        throw new ApiError(403,"User is not an artist")
    }

    const {thumbnail,name,track} = req.body
    const artist = req.user._id

    if([thumbnail,name,track].some((el) => {
        el.trim() === ""
    })){
        throw new ApiError(400,"All fields are required")
    }

    const userExists = await User.findById(artist)

    if(!userExists){
        throw new ApiError(401, "Artist does not exist")
    }

    const songDetails = {thumbnail,name,track,artist}

    const createdSong = await Song.create(songDetails)

    return res.status(200).json(
        new ApiResponse(200,createdSong,"Song created successfully")
    )

})

const getMySongs = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user

    const userSongs = await Song.find({artist: currentUser._id}) //agregation pagination required

    return res.status(200).json(
        new ApiResponse(200,userSongs,"Songs fetched successfully")
    )
})

const searchByName = asyncErrorHandler(async(req,res) => {
    const {name} = req.body

    
    if(name.trim === ""){
        throw new ApiError(400,"Please enter a valid song name")
    }

    const songs = await Song.find({  //learn about fuzzy search and aggregate required
        name: {
            $regex: name, $options: "i"
        }
    })

    return res.status(200).json(
        new ApiResponse(200,songs,"Songs fetched successfully")
    )
})

const searchByArtist = asyncErrorHandler(async(req,res) => {
    const {artistId} = req.params

    const artist = await User.findById(artistId)

    console.log(artist)

    if(!artist){
        throw new ApiError(400,"Artist does not exist")
    }

    const songs = await Song.find({artist: artistId})  //aggregation then

    return res.status(200).json(
        new ApiResponse(200,songs,"Songs fetched successfully")
    )
})

export {
    createSong,
    getMySongs,
    searchByName,
    searchByArtist
}
