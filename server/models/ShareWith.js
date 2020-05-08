const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    senders_photoURL: {
        type: String,
        required: true
    },
    senders_email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const ShareWith = mongoose.model('ShareWith', shareSchema)
module.exports = ShareWith