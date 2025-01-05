import mongoose, {Schema} from "mongoose"

const songSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    thumbnail: {
        type: String,
        required: true
    },
    track: {
        type: String,
        required: true
    }
})

export const Song = mongoose.model("Song", songSchema)