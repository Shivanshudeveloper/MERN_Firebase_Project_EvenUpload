const express = require('express');
const router = express.Router();


// Getting the People Confession Module
const ShareWith_Model = require('../models/ShareWith');


// Login Page
router.get('/', (req, res) => {
    res.send('welcome')
});

// Database CRUP Operations
// @POST Request for Share Contact
// INSERT 
router.post('/', (req, res) => {
    const { fileName, to, from, url, senders_photoURL, senders_email, message } = req.body;
    const newShare = new ShareWith_Model({
        fileName,
        to,
        from,
        url,
        message,
        senders_photoURL,
        senders_email
    });
    newShare.save()
        .then(
            res.status(200).json('Added')
        )
        .catch((err) => {
            res.status(400).json(`Error: ${err}`)
        })
});


// Database CRUP Operations
// @POST Request to GET the Contacts
// GET 
router.get('/contacts/:reciversEmail', (req, res) => {
    const { reciversEmail } = req.params;
    res.setHeader('Content-Type', 'application/json');
    ShareWith_Model.find({ to: reciversEmail }).sort({date: -1})
        .then(contacts => {
            res.status(200).json(contacts)
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});



module.exports = router;