const express = require('express');
const router = express.Router();
const axios = require('axios');
// Nodemailer
const nodemailer = require('nodemailer');


// Getting the People Confession Module
const ShareWith_Model = require('../models/ShareWith');
const ContactList_Model = require('../models/ContactList');
const Inbox_Model = require('../models/Inbox');

// Login Page
router.get('/', (req, res) => {
    res.send('welcome')
});

// Database CRUP Operations
// @POST Request for Share Contact
// INSERT 
router.post('/', (req, res) => {
    var { fileName, filename, to, from, url, senders_photoURL, senders_email, message } = req.body;
    
    let transporter, mailOption, mailText;

    var publicSharingURL = `https://storage.googleapis.com/aicte-admin-survey.appspot.com/uploads/${filename}`;
    var dynamicLinkApi = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyCVVlRXx3gRLIs6LiBlWAQuq9UjSUnb5Ms`;
    
    // Make a Request to Firebase Dynamic Links for the URL
    axios.post(dynamicLinkApi, {
        longDynamicLink: `https://evencloud.page.link/?link=${publicSharingURL}`
    }).then((response) => {
        url = response.data.shortLink
        
        mailText = `<h4>New File is shared by ${senders_email}.</h4><br/>
        ${message}
        <h4>Download File: <a href=${url}>Download</a></h4>
        <br />
        Transfer your files today with EvenCloud.<br /> Please visit at <a href="https://evenupload.now.sh">https://evenupload.now.sh</a>
        <br />
        NOTE: Please do not reply to this mail <br />
        Thank You <br />
        EvenCloud Team <br />
        <a href="https://evenupload.now.sh">https://evenupload.now.sh</a>
        `

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
                res.status(200).json('Added'),
                ContactList_Model.countDocuments({'contact_of': senders_email, 'contact': to})
                    .then((count) => {
                        if (count > 0) {
                            console.log("Find");
                        } else {
                            const newContact = new ContactList_Model({
                                contact: to,
                                contact_of: senders_email,
                                contact_photoURL: senders_photoURL
                            })
                            newContact.save()
                        }
                    }),
                
                // Successfully shared data triggering a mail to the data senders email address
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'evencloudupload@gmail.com',
                        pass: 'Ironman1.'
                    }
                }),
                mailOption = {
                    from: 'noreply@evencloud.com',
                    to: to,
                    subject: `File has been Received`,
                    html: mailText
                },
                transporter.sendMail(mailOption, (err, data) => {
                    console.log('Email Sent!');
                })
            )
            .catch((err) => {
                res.status(400).json(`Error: ${err}`)
            })
    })
});


// Database CRUD Operations
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


// Database CRUD Operations
// @GET Request to GET the Contacts
// GET 
router.get('/contactslist/:sendersEmail', (req, res) => {
    const { sendersEmail } = req.params;
    res.setHeader('Content-Type', 'application/json');
    ContactList_Model.find({ 'contact_of': sendersEmail }).sort({date: -1}).limit(5)
        .then(contactlist => {
            res.status(200).json(contactlist)
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @PUT Request to Update the Inbox
// UPDATE 
router.put('/inbox/:userId/:receiversEmail', (req, res) => {
    const { userId, receiversEmail } = req.params;
    var updateInbox;
    Inbox_Model.countDocuments({'receiversEmail': receiversEmail})
        .then((count) => {
            if (count > 0) {
                Inbox_Model.find({'receiversEmail': receiversEmail})
                    .then(data => {
                        updateInbox = parseInt(data[0].inbox);
                        updateInbox = updateInbox + 1;
                        Inbox_Model.findOneAndUpdate({'receiversEmail': receiversEmail}, { inbox: updateInbox }, {useFindAndModify: false})
                            .then(() => {
                                res.status(200).json('Updated Inbox')
                            })
                            .catch(err => console.log(err))
                    })
            } else {
                const newInbox = new Inbox_Model({
                    userId,
                    receiversEmail,
                    inbox: 1
                });
                newInbox.save()
                    .then(() => {
                        res.status(200).json('Added Inbox')
                    })
                    .catch(err => console.log(err))
            }
        })
});


// Database CRUD Operations
// @GET Request to GET the Inbox Count
// GET 
router.get('/inbox/:email', (req, res) => {
    const { email } = req.params;
    Inbox_Model.find({'receiversEmail': email})
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to RESET the Inbox Count
// POST 
router.put('/resetinbox/:email', (req, res) => {
    const { email } = req.params;
    Inbox_Model.find({'receiversEmail': email})
        .then(data => {
            Inbox_Model.findOneAndUpdate({'receiversEmail': email}, { inbox: 0 }, {useFindAndModify: false})
                .then(() => {
                    res.status(200).json('Reset Inbox')
                })
                .catch(err => console.log(err))
        })
});


module.exports = router;