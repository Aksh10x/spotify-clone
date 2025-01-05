import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { getToken } from "../utils/getToken.js"



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

const Login =asyncErrorHandler(async(req,res) => {
    const {email, password} = req.body

    if([email,password].some((el) => {
        el.trim() === ""
    })){
        throw new ApiError(400,"Fields email and password are required")
    }

    const user = await User.findOne({email: email})

    if(!user){
        throw new ApiError(400, "User does not exist")
    }

    const isMatch = await user.isPasswordCorrect(password)

    if(!isMatch){
        throw new ApiError(401, "Password is invalid")
    }

    const token = await getToken(user.email, user)

    delete user.password

    return res.status(200).json(
        new ApiResponse(200,{user, token},"User logged in successfully")
    )

})

export {
    Register,
    Login
}