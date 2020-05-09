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


const Share = ({ location }) => {
    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 
    let sendersEmail = sessionStorage.getItem("userEmail"); 

    const [filename, setFileName] = useState('');
    const [fileId, setFileId] = useState('');
    const [filePath, setFilePath] = useState('');
    const [uploaded, setUploaded] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [userphotoURL, setUserPhotoURL] = useState('');

    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);

    useEffect(() => {
        const { name, fileId } = queryString.parse(location.search);
        setFileName(name);
        setFileId(fileId);

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

        // Sharing Database Code
        // var starCountRef = database.ref('sharewith/Hr27iz1W1shBHAv5mqyOtGN56SI2').orderByChild("shareTo").equalTo('shivanshu@geu.ac.in');
        // starCountRef.on('value', function(snapshot) {
        //     console.log(snapshot.val());
        // });

    }, []);

    const share = (event) => {
        setSharing(true);
        var fileName = '';
        if (filename.split('_').pop().length > 40 ) {
            fileName = filename.split("_").pop().substring(0, 40) + '....'
        } else {
            fileName = filename.split("_").pop()
        }
        
        // Saved in Database about the User
        const uploadData = {
            fileName,
            filename,
            to: email,
            from: userId,
            url: filePath,
            senders_photoURL: userphotoURL,
            senders_email: sendersEmail,
            message
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
        
    }

    

    return (
        <Fragment>
            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
                <BrowserView>
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
                        <div className="header">{filename.split('_').pop()}</div>
                            <div style={{marginTop: '10px'}} className="meta">Uploaded On: {uploaded}</div>
                        </div>
                </div>

                <div className="ui hidden divider"></div>
                <div className="ui form">
                    <div className="field">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email Address" />
                    </div>
                </div>
                <div style={{marginTop: '4px'}} className="ui form">
                    <div className="field">
                        <label>Message</label>
                        <textarea onChange={(event) => setMessage(event.target.value)} rows="2">{message}</textarea>
                    </div>
                </div>
                <button style={{marginTop: '4px'}} onClick={() => share()} className={!sharing ? "ui green icon button" : "ui loading green icon button"}>
                    <i className="share icon"></i>
                    Share
                </button>
            </div>
        </Fragment>
    )
}

export default Share