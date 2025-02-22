import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

export const Photo = mongoose.model("Photo", PhotoSchema);

export default PhotoSchema