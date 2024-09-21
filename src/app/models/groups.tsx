
import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    groupname: {
        type: String,
        required: true
    }
});

const group = mongoose.model('group', groupSchema);

export default group; // Ensure this line is present to export the userlink model as default