const mongoose = require('mongoose');

const trackFileUpdateSchema = new mongoose.Schema({
    uploadedAt: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userPhotoUrl: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const trackFileUpdate = mongoose.model('trackfileupdate', trackFileUpdateSchema)
module.exports = trackFileUpdate