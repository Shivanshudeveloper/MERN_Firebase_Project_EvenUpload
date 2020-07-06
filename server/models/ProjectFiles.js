const mongoose = require('mongoose');

const projectFileSchema = new mongoose.Schema({
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
    userphotoURL: {
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
const projectFile = mongoose.model('projectfile', projectFileSchema)
module.exports = projectFile