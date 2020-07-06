const mongoose = require('mongoose');

const folderFilesSchema = new mongoose.Schema({
    folderName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: false
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    folderKey: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const folderfiles = mongoose.model('folderfiles', folderFilesSchema)
module.exports = folderfiles