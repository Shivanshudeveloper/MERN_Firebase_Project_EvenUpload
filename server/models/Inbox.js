const mongoose = require('mongoose');

const inboxSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    receiversEmail: {
        type: String,
        required: true
    },
    inbox: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Inbox = mongoose.model('Inbox', inboxSchema)
module.exports = Inbox