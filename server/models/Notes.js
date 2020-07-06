const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    userDisplayName: {
        type: String,
        required: false
    },
    userphotoURL: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const notes = mongoose.model('notes', notesSchema)
module.exports = notes