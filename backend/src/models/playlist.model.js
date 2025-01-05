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
        required: true
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: "Song"
    }],
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]

})

export const Playlist = mongoose.model("Playlist", playlistSchema)