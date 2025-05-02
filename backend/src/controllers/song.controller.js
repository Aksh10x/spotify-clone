import {User} from "../models/user.model.js";
import {Song} from "../models/song.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";


const createSong = asyncErrorHandler(async(req,res) => {
    
    const currentUser = req.user

    if(!currentUser.isArtist){
        throw new ApiError(400,"User is not an artist")
    }

    const {name} = req.body
    const artistId = req.user._id

    const thumbnailLocalPath = req.files?.thumbnail?.[0].path || ""
    const trackLocalPath = req.files?.track?.[0].path || ""

    
    if(name.trim() === ""){
        throw new ApiError(400,"All fields are required")
    }

    if(!(thumbnailLocalPath || trackLocalPath)){
        throw new ApiError(403,"Thumbnail and track are required")
    }

    const userExists = await User.findById(artistId)

    if(!userExists){
        throw new ApiError(401, "Artist does not exist")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const track = await uploadOnCloudinary(trackLocalPath)


    if(!(thumbnail || track)){
        throw new ApiError(400,"Thumbnail and track are required")
    }

    const createdSong = await Song.create({
        name,
        thumbnail: thumbnail.url,
        track: track.url,
        artist: artistId,
    })

    return res.status(200).json(
        new ApiResponse(200,createdSong,"Song successfully uploaded")
    )

})

const getMySongs = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user

    //const userSongs = await Song.find({artist: currentUser._id}) //agregation pagination required

    const userSongs = await Song.aggregate([
        {
            $match: {
                artist: new mongoose.Types.ObjectId(currentUser._id)
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "artist",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $addFields: {
                artistFirstName: "$owner.firstName",
                artistSecondName: "$owner.secondName"
            }
        },
        {
            $project: {
                artistFirstName: 1,
                artistSecondName: 1,
                track: 1,
                thumbnail: 1,
                name: 1,
            }
        }
    ])

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

const getOthersSongs = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user

    const {userId} = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId))

    if(!user){
        throw new ApiError(404,"User does not exist, not found")
    }

    const userSongs = await Song.aggregate([
        {
            $match: {
                artist: new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "artist",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $addFields: {
                artistFirstName: "$owner.firstName",
                artistSecondName: "$owner.secondName"
            }
        },
        {
            $project: {
                artistFirstName: 1,
                artistSecondName: 1,
                track: 1,
                thumbnail: 1,
                name: 1,
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200,userSongs,"Songs fetched successfully")
    )
})



export {
    createSong,
    getMySongs,
    searchByName,
    searchByArtist,
    getOthersSongs
}
