import jwt from "jsonwebtoken";

const getToken = (email, user) => {
    if (!user || !user._id) {
        throw new Error("User object is invalid or missing required fields");
    }
    return jwt.sign(
        { id: user._id, email: email }, 
        process.env.PASSPORT_SECRET
    );
    
};

export { getToken };
