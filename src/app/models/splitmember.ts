
import mongoose from 'mongoose';

const splitmemberSchema = new mongoose.Schema({
    split_id: {
        type: String,
        required: true
    },
    split_member: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    state: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
});

const splitmember = mongoose.models.splitmember || mongoose.model('splitmember', splitmemberSchema);

export default splitmember; // Ensure this line is present to export the userlink model as default