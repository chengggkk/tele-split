import mongoose from "mongoose";

const groupmemberSchema = new mongoose.Schema({
    groupname: {
        type: String,
        required: true,
    },
    groupID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: false,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    photoUrl: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: true,
    },
});

const groupmember =
    mongoose.models.groupmember ||
    mongoose.model("groupmember", groupmemberSchema);

export default groupmember; // Ensure this line is present to export the userlink model as default
