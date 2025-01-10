import mongoose, {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

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

songSchema.plugin(mongooseAggregatePaginate)

export const Song = mongoose.model("Song", songSchema)