import mongoose from "mongoose";
import { DB_NAME } from "../constants/dbName.js";


const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log("Database connected, host: ",connectionInstance.connection.host)
        
    } catch (error) {
        console.log("Database connection error:", error)
        process.exit(1)
    }
}

export default dbConnect