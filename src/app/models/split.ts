
import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema({
    Payer: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    Note: {
        type: String,
        required: true
    },
    groupID: {
        type: String,
        required: true
    },
    GenerateTIME: {
        type: Date,
        required: true,
        default: Date.now
    },
});

const split = mongoose.models.split || mongoose.model('split', splitSchema);

export default split; // Ensure this line is present to export the userlink model as default