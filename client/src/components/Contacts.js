import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';
import CryptoJS from 'crypto';

import {
    BrowserView,
    MobileView
} from 'react-device-detect';

// Components
import Menu from './Menu';
import MobileMenu from './MobileView/Menu';
import User from './User';

// API Service
import { API_SERVICE, SECRET_KEY } from '../config/URI';

// Utils
import Empty_Inbox_Temp_Image from  '../utils/empty_inbox.png';

// React Notification Toast
import { useToasts } from 'react-toast-notifications';

// Firebase
import { database } from '../Firebase/index';

const ContactList = ({ contact, saveFile, fileProjectAccepted, folderAccepted }) => {
    var date = new Date(contact.date);
    date = date.toDateString();
    var checkForProject = contact.url;
    
    return (
        <Fragment>
            {
                checkForProject === 'PROJECT' ? (
                    <div style={{marginTop: '10px'}} className="ui raised link fluid card">
                        <div className="content">
                            <div style={{float: 'right'}}>
                                {date}
                            </div>
                            <div className="header">{contact.fileName}</div>

                            <div className="meta">
                                <span style={{marginTop: '4px'}}>
                                    <i className="yellow star icon"></i> <span className="ui header tiny">PROJECT FILE</span> 
                                </span>
                            </div>
                            <div className="description">
                                <p>
                                    {contact.message}
                                </p>
                            </div>
                        </div>
                        <div className="extra content">
                            <BrowserView>
                                <div className="left floated author">
                                    <button onClick={() => fileProjectAccepted(contact.fileName, contact.message, contact.fileId)} className="ui small red button" >
                                        <i className="folder icon"></i>
                                        Accept the Project File
                                    </button>
                                </div>
                            </BrowserView>
                            <div className="right floated author">
                                <img className="ui avatar image" src={contact.senders_photoURL} /> {contact.senders_email}
                            </div>
                        </div>
                    </div>
                ) : checkForProject === 'FOLDER' ? (
                    <div style={{marginTop: '10px'}} className="ui raised link fluid card">
                        <div className="content">
                            <div style={{float: 'right'}}>
                                {date}
                            </div>
                            <div className="header">{contact.fileName}</div>

                            <div className="meta">
                                <span style={{marginTop: '4px'}}>
                                    <i className="orange star icon"></i> <span className="ui header tiny">FOLDER</span> 
                                </span>
                            </div>
                            <div className="description">
                                <p>
                                    {contact.message}
                                </p>
                            </div>
                        </div>
                        <div className="extra content">
                            <BrowserView>
                                <div className="left floated author">
                                    <button onClick={() => folderAccepted(contact.fileName, contact.fileId)} className="ui small orange button" >
                                        <i className="folder open icon"></i>
                                        Accept the Folder
                                    </button>
                                </div>
                            </BrowserView>
                            <div className="right floated author">
                                <img className="ui avatar image" src={contact.senders_photoURL} /> {contact.senders_email}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{marginTop: '10px'}} className="ui raised link fluid card">
                        <div className="content">
                            <div style={{float: 'right'}}>
                                {date}
                            </div>
                            <div className="header">{contact.fileName}</div>

                            <div className="meta">
                                <span style={{marginTop: '4px'}} className="category">
                                    <a target="_blank" href={contact.url}>
                                        Download File
                                    </a>
                                </span>
                            </div>
                            <div className="description">
                                <p>
                                    {contact.message}
                                </p>
                            </div>
                        </div>
                        <div className="extra content">
                            <BrowserView>
                                <div className="left floated author">
                                    <button onClick={() => saveFile(contact.senders_email, contact.senders_photoURL, contact.fileName, contact.url)} className="ui small violet button" >
                                        <i className="save icon"></i>
                                        Save File
                                    </button>
                                </div>

                                <div className="left floated author">
                                    <Link to={`/share?name=${contact.fileName}&fileId=${contact.fileId}&key=${contact.fileKey}`} className="ui small green button" >
                                        <i className="share square icon"></i>
                                        Forward
                                    </Link>
                                </div>
                            </BrowserView>
                            <div className="right floated author">
                                <img className="ui avatar image" src={contact.senders_photoURL} /> {contact.senders_email}
                            </div>
                        </div>
                    </div>
                )
            }
                
        </Fragment>
    )
}

const Contacts = () => {

    const { addToast } = useToasts();

    let userId = sessionStorage.getItem("userId");
    let sendersEmail = sessionStorage.getItem("userEmail"); 
    const [loading, setLoading] = useState(true);
    
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/contacts/${sendersEmail}`)
        .then(response => {
            setContacts(response.data);
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        axios.put(`${API_SERVICE}/api/v1/readwrite/resetinbox/${sendersEmail}`)
        .then(response => {
            console.log(response.status);
        })
    }, [])

    const saveFile = (senders_email, senders_photo,  file, url) => {
        axios.post(`${API_SERVICE}/api/v1/readwrite/savefiles`, {
            fileOf_usereId: userId,
            senders_email,
            senders_photo,
            file,
            url
        })
        .then(response => {
            console.log(response.status);
        })
        .catch(err => console.log(err))
        addToast(`${file} Saved Successfully`, { appearance: 'success', autoDismiss: true })
    }

    const fileProjectAccepted = (projectName, description, projectFileID) => {
        var uniqueKey = uuid4(); 
        uniqueKey =  uniqueKey +'_PRO_' + Date.now();
        // Generate the Date
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        date = dd + '/' + mm + '/' + yyyy;

        // Saved in Database about the User
        const uploadData = {
            date,
            projectName,
            description,
            uniqueKey,
            userId,
            sendersEmail,
            ownership: 2,
            refId: projectFileID
        }

        axios.post(`${API_SERVICE}/api/v1/readwrite/createproject`, uploadData)
            .then((res) => {
                if (res.status === 200) {
                    var mykey = CryptoJS.createCipher('aes-128-cbc', SECRET_KEY);
                    var eE = mykey.update(projectFileID, 'utf8', 'hex');
                    eE += mykey.final('hex');
                    window.location.href = `projects?pid=${eE}&n=${projectName}`
                } else if (res.status === 201) {
                    addToast(`Project with the name ${projectName} already exist`, { appearance: 'info', autoDismiss: true });
                }
            })
            .catch(err => console.log(err))
    }

    const folderAccepted = (folderName, fileKey) => {
            var date = new Date();
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            date = dd + '/' + mm + '/' + yyyy;

            // Saved in Database about the User
            const uploadData = {
                date,
                fileName: folderName,
                filePath: 'FOLDER',
                fileKey
            }

            database.ref(`files/${userId}`).push(uploadData, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Done");
                }
            });

            window.location.href = `folder?s=${fileKey}&n=${folderName}`
    }
    
    
    const showContactList = () => {
        return contacts.map(currentContact => {
            return <ContactList contact={currentContact} key={currentContact._id} saveFile={saveFile} fileProjectAccepted={fileProjectAccepted} folderAccepted={folderAccepted} />
        })
    }
        
    
    return (
        <Fragment>

            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>

                <BrowserView>
                    <div className="ui hidden divider"></div>
                    <Menu />
                </BrowserView>
                <MobileView>
                    <MobileMenu />
                </MobileView> 
            </div>
            
            <div className="ui left text aligned container">
                <div className="ui hidden divider"></div>

                   
                
                <div className="ui hidden divider"></div>
                
                {
                    loading ? (
                    <>
                        <div className="ui fluid placeholder">
                            <div className="image header">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                        <div className="ui fluid placeholder">
                            <div className="image header">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                        <div className="ui fluid placeholder">
                            <div className="image header">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                        <div className="ui fluid placeholder">
                            <div className="image header">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                    </>
                    ) : (
                        contacts && contacts.length ? (
                            <>
                                {showContactList()}
                            </>
                        ) : (
                            <>
                                <center>
                                    <img className="ui large image" src={Empty_Inbox_Temp_Image} />
                                </center>
                            </>
                        )

                    )
                }
                
                
            </div>
        </Fragment>
    )
}

export default Contacts
