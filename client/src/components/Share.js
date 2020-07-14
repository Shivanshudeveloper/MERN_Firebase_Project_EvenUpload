import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import {
    BrowserView,
    MobileView
  } from 'react-device-detect';
import axios from 'axios';
// React Notification Toast
import { useToasts } from 'react-toast-notifications';

// Firebase
import { auth, database } from '../Firebase/index';
// Components
import User from './User';
import Menu from './Menu';

// @From Mobile
import MobileMenu from './MobileView/Menu';

// API Service
import { API_SERVICE } from '../config/URI';

let recentContactListStyle = {
    maxHeight: '500px', 
    overflowX: 'scroll', 
    overflowX: 'hidden', 
    padding: '2px 18px 2px 18px',
    scrollbarColor: 'black',
    scrollbarWidth: 'thin'
}


const RecentContactList = ({ recentcontact, setEmail, email }) => {
    var emailAddr = recentcontact.contact;
    var finalEmailAddress = recentcontact.contact;
    if (email !== '') {
        finalEmailAddress = email + ',' + emailAddr;
    }
    return (
        <>
            <div onClick={() => setEmail(finalEmailAddress)} style={{cursor: 'pointer'}} className="ui segment pink">
                <i className="user circle big icon"></i> <span className="ui header"> {recentcontact.contact} </span>
            </div>
        </>
    )
}


const Share = ({ location }) => {
    // Adding the Toaster for React Notification so no need of Custom Messanging
    const { addToast } = useToasts();

    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 
    let sendersEmail = sessionStorage.getItem("userEmail"); 

    const [filename, setFileName] = useState('');
    const [fileId, setFileId] = useState('');
    const [filePath, setFilePath] = useState('');
    const [uploaded, setUploaded] = useState('');
    let [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [userphotoURL, setUserPhotoURL] = useState('');
    const [contactlist, setContactList] = useState([]);
    const [fileKey, setFileKey] = useState('');

    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [recentLoading, setRecentLoading] = useState(true);

    
    

    useEffect(() => {
        const { name, fileId, key } = queryString.parse(location.search);
        setFileName(name);
        setFileId(fileId);
        setFileKey(key);

        var starCountRef = database.ref(fileId);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            var path = fileData.filePath;
            var uploaded = fileData.date;
            setFilePath(path);
            setUploaded(uploaded);
        });

        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUserPhotoURL(user.photoURL);
            } else {
                console.log("No");
                window.location.href = "/";
            }
        });

        axios.get(`${API_SERVICE}/api/v1/readwrite/contactslist/${sendersEmail}`)
        .then(response => {
            setContactList(response.data);
            setRecentLoading(false);
        })
    }, []);

    const share = (event) => {
        setSharing(true);
        var fileName = '';
        if (filename.length > 40 ) {
            fileName = filename.substring(0, 40) + '....'
        } else {
            fileName = filename
        }

        email = email.split(' ').join('');
        
        // Saved in Database about the User
        const uploadData = {
            fileName,
            to: email,
            from: userId,
            url: filePath,
            senders_photoURL: userphotoURL,
            senders_email: sendersEmail,
            message,
            fileKey,
            fileId
        }

        axios.post(`${API_SERVICE}/api/v1/readwrite`, uploadData)
            .then((res) => {
                console.log(res.status)
                if (res.status === 200) {
                    setLoading(true);
                    setSharing(false);
                    addToast(`Successfully Shared`, { appearance: 'success', autoDismiss: true })
                }
            })
            .catch(err => console.log(err))

        axios.put(`${API_SERVICE}/api/v1/readwrite/inbox/${userId}/${email}`)
            .then(res => console.log(res.status))
            .catch(err => console.log(err))
    }

    const showRecentContacts = () => {
        return contactlist.map(recentcontact => {
            return <RecentContactList recentcontact={recentcontact} setEmail={setEmail} email={email} key={recentcontact._id} />
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
            <div className="ui text aligned container">

                <div className="ui hidden divider"></div>

                <div className="ui form">
                    <div className="field">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email Address" />
                    </div>
                </div>
                <div style={{marginTop: '4px'}} className="ui form">
                    <div className="field">
                        <label>Message <small>(Optional)</small></label> 
                        <textarea onChange={(event) => setMessage(event.target.value)} rows="2">{message}</textarea>
                    </div>
                </div>
                
                {
                    recentLoading ? (
                        <>
                            <div className="ui large header">Fetching Recents</div>
                            <div className="ui three column stackable grid">
                                <div className="column">
                                    <div className="ui raised segment">
                                    <div className="ui placeholder">
                                        <div className="paragraph">
                                        <div className="medium line"></div>
                                        <div className="short line"></div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui raised segment">
                                    <div className="ui placeholder">
                                        <div className="paragraph">
                                        <div className="medium line"></div>
                                        <div className="short line"></div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui raised segment">
                                    <div className="ui placeholder">
                                        <div className="paragraph">
                                        <div className="medium line"></div>
                                        <div className="short line"></div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        contactlist && contactlist.length ? (
                            <>
                                <div className="ui segments">
                                    <div className="ui secondary segment">
                                        <div className="ui header">Select from Recents <BrowserView style={{float: 'right'}}>{filename}</BrowserView> </div> 
                                    </div>
                                    <div style={recentContactListStyle}>
                                        {showRecentContacts()}
                                    </div>
                                </div>
                            </>
                        ) : null
                    )
                }
                <button style={{marginTop: '6px'}} onClick={() => share()} className={!sharing ? "ui green fluid icon big button" : "ui loading fluid big icon button"}>
                    <i className="share icon"></i>
                    Share
                </button>

                


                

                <div className="ui hidden divider"></div>
                
                
            </div>
            <div className="ui hidden divider"></div>
            <div className="ui hidden divider"></div>

        </Fragment>
    )
}

export default Share