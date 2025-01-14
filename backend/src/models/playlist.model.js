import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    thumbnail: {
        type: String,
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: "Song"
    }],
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    description: {
        type: String,
    }

})

export const Playlist = mongoose.model("Playlist", playlistSchema)