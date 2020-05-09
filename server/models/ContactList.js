const mongoose = require('mongoose');

const contactlistSchema = new mongoose.Schema({
    contact: {
        type: String,
        required: true
    },
    contact_of: {
        type: String,
        required: true
    },
    contact_photoURL: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const ContactList = mongoose.model('ContactList', contactlistSchema)
module.exports = ContactList