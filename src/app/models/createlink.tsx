import mongoose from "mongoose";

const sharelinkSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    sharelink: {
        type: String,
        required: true,
    },
    groupID: {
        type: String,
        required: true,
    },
    generateTIME: {
        type: Date,
        required: true,
        default: Date.now,
    },
    groupname: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: false,
    },
});

const sharelink = mongoose.model("sharelink", sharelinkSchema);

export default sharelink; // Ensure this line is present to export the userlink model as default
