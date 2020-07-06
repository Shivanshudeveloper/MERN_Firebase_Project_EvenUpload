const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    createdAt: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    pid: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ownership: {
        type: Number,
        required: true
    },
    refId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const project = mongoose.model('project', projectSchema)
module.exports = project