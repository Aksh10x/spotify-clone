import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { getToken } from "../utils/getToken.js"
import {Song} from "../models/song.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const checkMailUnique = asyncErrorHandler(async(req,res) => {
    const {email} = req.body

    const userByEmailExists = await User.findOne({email: email})

    if(userByEmailExists){
        throw new ApiError(400, "User wih email already exists")
    }

    return res.status(200).json(
        new ApiResponse(200,{},"Email is unique")
    )
})


const Register = asyncErrorHandler(async(req,res) => {
    const {email,username,firstName,secondName,password} = req.body;
    
    if([email,username,password,firstName].some((el) => {
        el.trim() === ""
    })){
        throw new ApiError(400,"Fields email, username, firstName and password are required")
    }

    const userByEmailExists = await User.findOne({email: email}) 

    if(userByEmailExists){
        throw new ApiError(403,"User with this email already exists")
    }

    const newUser = await User.create({
        email,
        username,
        firstName,
        secondName,
        password
    })

    const createdUser = await User.findById(newUser._id).select("-password")
    const token = await getToken(email, newUser)

    return res.status(200).json(
        new ApiResponse(200,{createdUser, token},"User registered successfully"))

})

const Login = asyncErrorHandler(async(req,res) => {
    const {identifier, password} = req.body

    if([identifier,password].some((el) => {
        el.trim() === ""
    })){
        throw new ApiError(400,"Email and password are required")
    }

    const user = await User.findOne({
        $or: [
            {email: identifier},
            {username: identifier}
        ]
    })

    if(!user){
        throw new ApiError(400, "User does not exist")
    }

    const isMatch = await user.isPasswordCorrect(password)

    if(!isMatch){
        throw new ApiError(401, "Password is invalid")
    }

    const token = getToken(user.email, user)


    delete user.password

    return res.status(200).json(
        new ApiResponse(200,{user, token},"User logged in successfully")
    )

})

const ToggleArtist = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user

    const user = await User.findById(currentUser._id)

    if(!user){
        throw new ApiError(404,"User does not success")
    }

    if(user.isArtist){
        user.isArtist = false
        await Song.deleteMany({artist: user._id})
        await user.save({validateBeforeSave: false})

        return res.status(200).json(
            new ApiResponse(200,{},"User is no more an artist, all songs deleted")
        )
    }
    else{
        user.isArtist = true
        await user.save()
        return res.status(200).json(
            new ApiResponse(200,{},"User is now an artist")
        )
    }   

})

const getUserDetails = asyncErrorHandler(async(req, res) => {

    const currentUser = req.user

    delete currentUser.password

    return res.status(200).json(
        new ApiResponse(200,currentUser,"User details fetched successfully")
    )
});

const becomeArtist = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user
    const {firstName,secondName} = req.body
    const avatarLocalPath = req.file?.path 


    const user = await User.findById(currentUser._id)

    if(firstName.trim() === ""){
        throw new ApiError(400,"First name is required")
    }

    if(!avatarLocalPath && !user.avatar){
        throw new ApiError(400,"Avatar is required for an artist profile")
    }

    
    if(avatarLocalPath){
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        if(!avatar){
        throw new ApiError(400,"Avatar is required for an artist profile")
        }
        user.avatar = avatar.url
        user.firstName = firstName
        user.secondName = secondName
        user.isArtist = true
    }else{
        user.firstName = firstName
        user.secondName = secondName
        user.isArtist = true
    }

    const newArtist = user.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(200,newArtist,"Artist account successfully created")

        
    )
})

const editUserDetails = asyncErrorHandler(async(req,res) => {
    const currentUser = req.user
    const {firstName,secondName} = req.body
    const avatarLocalPath = req.file?.path
    const deletePhoto = req.body.deletePhoto === "true";

    if(firstName.trim() === ""){
        throw new ApiError(400,"First name is required")
    }

    const user = await User.findById(currentUser._id)

    const currentURL = user.avatar

    if(deletePhoto){
        user.avatar = ""
        user.firstName = firstName
        user.secondName = secondName
        const newArtist = user.save({validateBeforeSave: false})

        return res.status(200).json(
            new ApiResponse(200,newArtist,"Details updated successfully")
        )
    }

    if(!avatarLocalPath && currentURL){
        user.avatar = currentURL
        user.firstName = firstName
        user.secondName = secondName

        const newArtist = user.save({validateBeforeSave: false})

        return res.status(200).json(
            new ApiResponse(200,newArtist,"Details updated successfully")
        )
    }

    if(avatarLocalPath){
        const avatar = await uploadOnCloudinary(avatarLocalPath)

        if(!avatar){
            throw new ApiError(400,"Something went wrong, try again later.")
        }
    
        const user = await User.findById(currentUser._id)
        user.avatar = avatar.url
        user.firstName = firstName
        user.secondName = secondName
    
        const newArtist = user.save({validateBeforeSave: false})
    
        return res.status(200).json(
            new ApiResponse(200,newArtist,"Details updated successfully")
    
            
        )
    }
})

export {
    checkMailUnique,
    Register,
    Login,
    getUserDetails,
    ToggleArtist,
    becomeArtist,
    editUserDetails
}