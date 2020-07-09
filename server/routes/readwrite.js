const express = require('express');
const router = express.Router();
const axios = require('axios');
// Nodemailer
const nodemailer = require('nodemailer');


// Getting the People Confession Module
const ShareWith_Model = require('../models/ShareWith');
const ContactList_Model = require('../models/ContactList');
const Inbox_Model = require('../models/Inbox');
const SavedFiles_Model = require('../models/SavedFiles');
const Project_Model = require('../models/Project');
const ProjectFile_Model = require('../models/ProjectFiles');
const TrackFileUpdate_Model = require('../models/TrackFileUpdate');
const FolderFiles_Model = require('../models/FolderFiles');
const Notes_Model = require('../models/Notes');
// Login Page
router.get('/', (req, res) => {
    res.send('welcome')
});

// Database CRUP Operations
// @POST Request for Share Contact
// INSERT 
router.post('/', (req, res) => {
    var { fileName, to, from, url, senders_photoURL, senders_email, message, fileKey, fileId } = req.body;
    
    if (url === 'PROJECT') {

        let transporter, mailOption, mailText, emailArr;

            mailText = `<h4>New File is shared by ${senders_email}.</h4><br/>
            ${message}
            <h4>PLEASE VISIT <a href="https://evenupload.now.sh">https://evenupload.now.sh</a> AND CHECK YOUR INBOX FOR THE PROJECT FILE</h4>
            <br />
            An Easy File Management for your files today with EvenCloud.<br /> Please visit at <a href="https://evenupload.now.sh">https://evenupload.now.sh</a>
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
                senders_email,
                fileId
            });
            
            newShare.save()
                .then(
                    res.status(200).json('Added'),
                    emailArr = to.split(','),
                    emailArr.forEach(e => {
                        ContactList_Model.countDocuments({'contact_of': senders_email, 'contact': e})
                        .then((count) => {
                            if (count > 0) {
                                console.log("Find");
                            } else {
                                const newContact = new ContactList_Model({
                                    contact: e,
                                    contact_of: senders_email,
                                    contact_photoURL: senders_photoURL
                                })
                                newContact.save()
                            }
                        })
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

    } else if (url === 'FOLDER') {
        let transporter, mailOption, mailText, emailArr;

        mailText = `<h4>Folder ${fileName} is shared by ${senders_email}.</h4><br/>
        ${message}
        <h4>PLEASE VISIT <a href="https://evenupload.now.sh">https://evenupload.now.sh</a> AND CHECK YOUR INBOX FOR THE FOLDER SHARED by ${senders_email}</h4>
        <br />
        An Easy File Management for your files today with EvenCloud.<br /> Please visit at <a href="https://evenupload.now.sh">https://evenupload.now.sh</a>
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
            senders_email,
            fileId
        });
        
        newShare.save()
            .then(
                res.status(200).json('Added'),
                emailArr = to.split(','),
                emailArr.forEach(e => {
                    ContactList_Model.countDocuments({'contact_of': senders_email, 'contact': e})
                    .then((count) => {
                        if (count > 0) {
                            console.log("Find");
                        } else {
                            const newContact = new ContactList_Model({
                                contact: e,
                                contact_of: senders_email,
                                contact_photoURL: senders_photoURL
                            })
                            newContact.save()
                        }
                    })
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
    } else {
        let transporter, mailOption, mailText, emailArr;

        var publicSharingURL = `https://storage.googleapis.com/evencloud-26d32.appspot.com/uploads/${fileKey}`;
        var dynamicLinkApi = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBSEx2-ykPTb70keLZh3LAuDtQT2VyCsco`;
        
        // Make a Request to Firebase Dynamic Links for the URL
        axios.post(dynamicLinkApi, {
            longDynamicLink: `https://evenupload.page.link/?link=${publicSharingURL}`
        }).then((response) => {
            url = response.data.shortLink
            mailText = `<h4>New File is shared by ${senders_email}.</h4><br/>
            ${message}
            <h4>Download File: <a href=${url}>Download</a></h4>
            <br />
            An Easy File Management for your files today with EvenCloud.<br /> Please visit at <a href="https://evenupload.now.sh">https://evenupload.now.sh</a>
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
                senders_email,
                fileKey,
                fileId
            });
            
            newShare.save()
                .then(
                    res.status(200).json('Added'),
                    emailArr = to.split(','),
                    emailArr.forEach(e => {
                        ContactList_Model.countDocuments({'contact_of': senders_email, 'contact': e})
                        .then((count) => {
                            if (count > 0) {
                                console.log("Find");
                            } else {
                                const newContact = new ContactList_Model({
                                    contact: e,
                                    contact_of: senders_email,
                                    contact_photoURL: senders_photoURL
                                })
                                newContact.save()
                            }
                        })
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
    }

    
});


// Database CRUD Operations
// @POST Request to GET the Contacts
// GET 
router.get('/contacts/:reciversEmail', (req, res) => {
    const { reciversEmail } = req.params;
    res.setHeader('Content-Type', 'application/json');
    var regexEmail = new RegExp(reciversEmail);
    ShareWith_Model.find({ to: regexEmail }).sort({date: -1})
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
    ContactList_Model.find({ 'contact_of': sendersEmail }).sort({date: -1}).limit(6)
        .then(contactlist => {
            res.status(200).json(contactlist)
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations work
// @PUT Request to Update the Inbox
// UPDATE 
router.put('/inbox/:userId/:receiversEmail', (req, res) => {
    const { userId, receiversEmail } = req.params;
    var updateInbox;
    let emailArr;
    emailArr = receiversEmail.split(',');
    emailArr.forEach(e => {
        Inbox_Model.countDocuments({'receiversEmail': e})
        .then((count) => {
            if (count > 0) {
                Inbox_Model.find({'receiversEmail': e})
                    .then(data => {
                        updateInbox = parseInt(data[0].inbox);
                        updateInbox = updateInbox + 1;
                        Inbox_Model.findOneAndUpdate({'receiversEmail': e}, { inbox: updateInbox }, {useFindAndModify: false})
                            .then(() => {
                                console.log("Done")
                            })
                            .catch(err => console.log(err))
                    })
            } else {
                const newInbox = new Inbox_Model({
                    userId,
                    receiversEmail: e,
                    inbox: 1
                });
                newInbox.save()
                    .then(() => {
                        console.log("Done")
                    })
                    .catch(err => console.log(err))
            }
        })
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


// Database CRUD Operations
// @POST Request to Save the Files
// POST 
router.post('/savefiles', (req, res) => {
    var { fileOf_usereId, senders_email, senders_photo, file, url } = req.body;

    SavedFiles_Model.countDocuments({'url': url, 'fileOf_usereId': fileOf_usereId})
        .then((count) => {
            if (count > 0) {
                res.status(200).json('File Already Added')
            } else {
                const newSaveFile = new SavedFiles_Model({
                    fileOf_usereId,
                    senders_email,
                    senders_photo,
                    file,
                    url,
                });
                newSaveFile.save()
                    .then(() => {
                        res.status(200).json('Saved Files')
                    })
                    .catch(err => console.log(err))
            }
        })
});


// Database CRUD Operations
// @GET Request to Get all the save files
// GET 
router.get('/savefiles/:userId', (req, res) => {
    const { userId } = req.params;
    let emailArr = [];
    SavedFiles_Model.find({'fileOf_usereId': userId})
    .then(data => {
        data.map((email) => {
            var data = {
                id: email._id,
                email: email.senders_email,
                photoUrl: email.senders_photo
            }
            
            emailArr.push(data);
        });
        const filteredArr = emailArr.reduce((acc, current) => {
            const x = acc.find(item => item.email === current.email);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
        }, []);
        res.status(200).json(filteredArr)

        // emailArr.splice(0, emailArr.length, ...(new Set(emailArr)));
        // console.log(emailArr);
        // res.status(200).json(emailArr)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});

// Database CRUD Operations
// @GET Request to Get all the save files for a perticular contact
// GET 
router.get('/savefiles/:userId/:senderEmail', (req, res) => {
    const { userId, senderEmail } = req.params;
    SavedFiles_Model.find({'fileOf_usereId': userId, 'senders_email': senderEmail}).sort({date: -1})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @GET Request to Get all people with whome file is shared
// GET 
router.get('/sharedwith/:userId/:fileName', (req, res) => {
    const { userId, fileName } = req.params;
    ShareWith_Model.find({'from': userId, 'fileName': fileName}).sort({date: -1})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to create a new project for a user
// POST 
router.post('/createproject', (req, res) => {
    const { date, projectName, description, uniqueKey, userId, sendersEmail, ownership, refId } = req.body;

    Project_Model.countDocuments({'projectName': projectName, 'uid': userId})
        .then((count) => {
            if (count > 0) {
                res.status(201).json('Already Exist')
            } else {
                const newProject = new Project_Model({
                    createdAt: date,
                    projectName,
                    description,
                    pid: uniqueKey,
                    uid: userId,
                    email: sendersEmail,
                    ownership,
                    refId
                });
                newProject.save()
                    .then((data) => {
                        res.status(200).json(data)
                    })
                    .catch(err => console.log(err))
            }
        })
});

// Database CRUD Operations
// @GET Request to Get all project list of that user
// GET 
router.get('/projectlist/:userId', (req, res) => {
    const { userId } = req.params;
    Project_Model.find({'uid': userId}).sort({date: -1})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});

// Database CRUD Operations
// @POST Request to create a new project file for a user
// POST 
router.post('/uploadprojectfile', (req, res) => {
    const { date, projectId, projectName, fileName, filePath, uniquetwoKey, userId, userEmail, userDisplayName, userphotoURL, comments } = req.body;

    ProjectFile_Model.countDocuments({ 'pid': projectId, 'fileName': fileName})
        .then((count) => {
            if (count > 0) {
                ProjectFile_Model.findOneAndUpdate({'pid': projectId, 'fileName': fileName}, { 'filePath': filePath, 'comments': comments, userphotoURL: userphotoURL, 'uploadedAt': date }, {useFindAndModify: false})
                        .then(() => {
                            const newTrackProjectFile = new TrackFileUpdate_Model({
                                uploadedAt: date,
                                pid: projectId,
                                projectName,
                                fileName,
                                filePath,
                                fileId: uniquetwoKey,
                                uid: userId,
                                userEmail,
                                userName: userDisplayName,
                                userPhotoUrl: userphotoURL,
                                comments
                            });
                            newTrackProjectFile.save()
                                .then(() => {
                                    res.status(200).json('Project File Uploaded')
                                })
                                .catch(err => res.status(500).json(`Server Error ${err}`))
                        })
                        .catch(err => res.status(500).json(`Server Error ${err}`))
            } else {
                const newProjectFile = new ProjectFile_Model({
                    uploadedAt: date,
                    pid: projectId,
                    projectName,
                    fileName,
                    filePath,
                    fileId: uniquetwoKey,
                    uid: userId,
                    userphotoURL,
                    comments,
                    userEmail
                });
                newProjectFile.save()
                    .then(() => {
                        const newTrackProjectFile = new TrackFileUpdate_Model({
                            uploadedAt: date,
                            pid: projectId,
                            projectName,
                            fileName,
                            filePath,
                            fileId: uniquetwoKey,
                            uid: userId,
                            userEmail,
                            userName: userDisplayName,
                            userPhotoUrl: userphotoURL,
                            comments
                        });
                        newTrackProjectFile.save()
                            .then(() => {
                                res.status(200).json('Project File Uploaded')
                            })
                            .catch(err => res.status(500).json('Server Error'))
                    })
                    .catch(err => res.status(500).json('Server Error'))
            }
        })
        .catch(err => res.status(500).json('Server Error'))
});

// Database CRUD Operations
// @GET Request to Get all project file list of that user
// GET 
router.get('/projectfilelist/:pid/:uid', (req, res) => {
    const { pid, uid } = req.params;
    ProjectFile_Model.find({'pid': pid}).sort({date: -1})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @GET Request to Get about project
// GET 
router.get('/aboutproject/:pid/:uid', (req, res) => {
    const { pid, uid } = req.params;
    Project_Model.findOne({'_id': pid}).sort({date: -1})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});

// Database CRUD Operations
// @GET Request to Get all the files track about project
// GET 
router.get('/allfiletrack/:pid/:uid/:fname', (req, res) => {
    const { pid, uid, fname } = req.params;
    TrackFileUpdate_Model.find({'fileName': fname, 'pid': pid})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});

// Database CRUD Operations
// @POST Request to add a file in a folder
// POST 
router.post('/uploadfolderfiles', (req, res) => {
    const { folderName, userId, userEmail, fileName, filePath,folderKey } = req.body;

    const newFolderFiles = new FolderFiles_Model({
        folderName,
        userId,
        userEmail,
        fileName,
        filePath,
        folderKey
    });
    newFolderFiles.save()
        .then(() => {
            res.status(200).json('File Uploaded')
        })
        .catch(err => res.status(500).json('Server Error'))
});

// Database CRUD Operations
// @GET Request to get all the folder files
// GET 
router.get('/folderfiles/:folderName/:folderKey', (req, res) => {
    const { folderName, folderKey } = req.params;
    FolderFiles_Model.find({'folderKey': folderKey, 'folderName': folderName}).sort({date: -1})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});

// Database CRUD Operations
// @POST Request to add a new Note
// POST
router.post('/addnote', (req, res) => {
    const { projectId, note, userDisplayName, userphotoURL } = req.body;
    const newNotes = new Notes_Model({
        projectId,
        note,
        userDisplayName,
        userphotoURL
    });
    newNotes.save()
        .then(() => {
            res.status(200).json('Note Added')
        })
        .catch(err => res.status(500).json(`Server Error is ${err}`))
});


// Database CRUD Operations
// @GET Request to get all the Notes
// GET
router.get('/showNotes/:projectId', (req, res) => {
    const { projectId } = req.params;
    Notes_Model.find({'projectId': projectId}).sort({date: -1})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
});

module.exports = router;