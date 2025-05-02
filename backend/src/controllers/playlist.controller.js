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

    const playlistExists = await Playlist.findById(playlistId)

    if(!playlistExists){
        throw new ApiError(404,"Playlist does not exist, not found")
    }

    if(playlistExists.songs.length === 0){
        const owner = await User.findById(playlistExists.owner)
        return res.status(200).json(
            new ApiResponse(200,{playlist: [playlistExists], owner: owner.firstName + " " + owner.secondName},"Playlist fetched successfully")
        )
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $project: {
                name: 1,
                songs: 1,
                description: 1,
                thumbnail: 1,
                owner: 1,

            },
        },
        {
            $unwind: {
              path: "$songs",
              includeArrayIndex: "orderIndex",
              preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "songs",
                let: { songId: "$songs" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$songId"] },
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "artist",
                            foreignField: "_id",
                            as: "artistDetails",
                        },
                    },
                    { $unwind: "$artistDetails" },
                    {
                        $addFields: {
                            artistFirstName: "$artistDetails.firstName",
                            artistSecondName: "$artistDetails.secondName",
                        },
                    },
                    {
                        $project: {
                            artistDetails: 0,
                        },
                    },
                ],
                as: "songDetails",
            },
        },
        {
            $unwind: "$songDetails",
        },
        {
            $group: {
                _id: "$_id",
                description: { $first: "$description" },
                thumbnail: { $first: "$thumbnail" },
                owner: { $first: "$owner" },
                name: { $first: "$name" },
                songs: {
                    $push: {
                        $mergeObjects: [
                            "$songDetails",
                            { orderIndex: "$orderIndex" }
                        ],
                    },
                },
            },
        },
        {
            $addFields: {
                songs: {
                    $sortArray: {
                        input: "$songs",
                        sortBy: { orderIndex: 1 }, // sort by the original array order
                    },
                },
            },
        },
        {
            $project: {
                "songs.orderIndex": 0, // Clean up
            },
        },
    ]);    

    const owner = await User.findById(playlist[0].owner)
    

    if(!playlist){
        throw new ApiError(404, "Playlist does not exist, not found")
    }

    return res.status(200).json(
        new ApiResponse(200, {playlist: playlist, ownerName: owner.firstName + " " + owner.secondName}, "Playlist fetched successfully")
    )
})


const getUserPlaylists = asyncErrorHandler(async(req,res) => {
    const {userId} = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId))

    if(!user){
        throw new ApiError(404,"User does not exist, not found")
    }

    const playlists = await Playlist.find({owner: userId})

    const playlistsToSend = playlists.map((p) => {
        return {
        name: p.name,
        description: p.description,
        thumbnail: p.thumbnail,    
        owner: user.firstName + " " + user.secondName,
        _id: p._id
        }
    })

    return res.status(200).json(
        new ApiResponse(200,playlistsToSend,"Playlists fetched successfully")
    )
})

const addSongToPlaylist = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user
    const {songId, playlists} = req.body

    for (let i = 0; i < playlists.length; i++) {
        const playlist = await Playlist.findById(playlists[i].id)

        if(!playlist){
            throw new ApiError(404,"Playlist doesnt exist, not found")
        }

        if(playlist.owner.toString() != currentUser._id.toString() && 
        !playlist.collaborators.includes(currentUser._id)){
            throw new ApiError(401,"User does not own playlist")
        }

        const song = await Song.findById(songId)

        if(playlists[i].add){

            if(!song){
                throw new ApiError(404,"Song doesnt exist, not found")
            }

            playlist.songs.push(songId)

            await playlist.save({validateBeforeSave: false})
        }else{
            playlist.songs = playlist.songs.filter(id => id.toString() !== songId.toString());

            await playlist.save({validateBeforeSave: false})
        }       
    }

    return res.status(200).json(
        new ApiResponse(200,{}, "Song added/removed to/from playlist successfully")
    )
})

const songExistsInPlaylist = asyncErrorHandler(async(req,res) => {
    const {songId, playlistId} = req.body

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    const song = await Song.findById(songId)

    if(!song){
        throw new ApiError(404, "Song not found")
    }

    const songExists = playlist.songs.some((song) => song.toString() === songId.toString())

    if(songExists){
        return res.status(200).json(
            new ApiResponse(200,{exists: true},"Song exists in playlist")
        )
    }

    return res.status(200).json(
        new ApiResponse(200,{exists: false},"Song does not exist in playlist")
    )
})

const deletePlaylist = asyncErrorHandler(async(req,res) => {
    const {playlistId} = req.params

    const currentUser = req.user

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlist does not exist, not found")
    }
    if(playlist.owner.toString() != currentUser._id.toString()){
        throw new ApiError(401,"User does not own playlist")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json(
        new ApiResponse(200,{}, "Playlist deleted successfully.")
    )
})

export {
    createPlaylist,
    getPlaylist,
    addSongToPlaylist,
    getUserPlaylists,
    songExistsInPlaylist,
    deletePlaylist
}