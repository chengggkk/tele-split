
import mongoose from 'mongoose';

const sharelinkSchema = new mongoose.Schema({
    groupname: {
        type: String,
        required: true
    },
    members: {
        type: String,
        required: true
    },
    generateTIME: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const sharelink = mongoose.model('sharelink', sharelinkSchema);

export default sharelink; // Ensure this line is present to export the userlink model as default