import cors from "cors"
import express from "express"


const app = express();
//configs
app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json({
    limit: "20kb"
}))

app.use(express.urlencoded({
    limit: "20kb",
    extended: true,
}))


//routes
import UserRouter from "./routes/user.routes.js"
import SongRouter from "./routes/song.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import errorHandler from "./middlewares/apiErrorHandler.js";

app.use("/api/user", UserRouter)
app.use("/api/song", SongRouter)
app.use("/api/playlist", playlistRouter)

app.use(errorHandler)


export {app};
