const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    fileOf_usereId: {
        type: String,
        required: true
    },
    senders_email: {
        type: String,
        required: true
    },
    senders_photo: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const SavedFiles = mongoose.model('SavedFiles', saveSchema)
module.exports = SavedFiles