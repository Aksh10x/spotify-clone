import jwt from "jsonwebtoken"

const getToken = (email, user) => {
    return jwt.sign({identifier: user._id}, process.env.PASSPORT_SECRET)
}

export {getToken}