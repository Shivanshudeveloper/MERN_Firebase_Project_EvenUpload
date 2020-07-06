import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import {
    BrowserView,
    MobileView
  } from 'react-device-detect';
import axios from 'axios';

// Firebase
import { auth, database } from '../Firebase/index';
// Components
import User from './User';
import Menu from './Menu';
import Messages from "./Messages";

// @From Mobile
import MobileMenu from './MobileView/Menu';

// API Service
import { API_SERVICE } from '../config/URI';


const RecentContactList = ({ recentcontact, setEmail, email }) => {
    var emailAddr = recentcontact.contact;
    var finalEmailAddress = recentcontact.contact;
    if (email !== '') {
        finalEmailAddress = email + ',' + emailAddr;
    }
    return (
        <>
            <div onClick={() => setEmail(finalEmailAddress)} className="ui raised link card green">
                <div className="content">
                    <div className="ui tiny header">{recentcontact.contact}</div>
                </div>
            </div>
        </>
    )
}


const Share = ({ location }) => {
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
                    setTimeout(() => setLoading(false), 2000);
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


                {
                    loading ? (
                        <Messages msg={'Successfully Shared'} />
                    ) : null
                }
                <div className="ui hidden divider"></div>

                
                <div className="ui fluid card">
                    <div className="content">
                        <div className="header">{filename}</div>
                            <div style={{marginTop: '10px'}} className="meta">Uploaded On: {uploaded}</div>
                        </div>
                </div>
                <div className="ui hidden divider"></div>

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
                                <div className="ui large header">Recents</div>
                                <div className="ui two stackable cards">
                                    {showRecentContacts()}
                                </div>
                            </>
                        ) : null
                    )
                }

                


                

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
                <BrowserView>
                    <button style={{marginTop: '6px'}} onClick={() => share()} className={!sharing ? "ui green icon button" : "ui loading green icon button"}>
                        <i className="share icon"></i>
                        Share
                    </button>
                </BrowserView>
                <MobileView>
                    <button style={{marginTop: '6px'}} onClick={() => share()} className={!sharing ? "ui green fluid icon button" : "ui loading fluid green icon button"}>
                        <i className="share icon"></i>
                        Share
                    </button>
                </MobileView>
                
            </div>
            <div className="ui hidden divider"></div>
            <div className="ui hidden divider"></div>

        </Fragment>
    )
}

export default Share