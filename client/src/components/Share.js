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




const Share = ({ location }) => {
    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 
    let sendersEmail = sessionStorage.getItem("userEmail"); 

    const [filename, setFileName] = useState('');
    const [fileId, setFileId] = useState('');
    const [filePath, setFilePath] = useState('');
    const [uploaded, setUploaded] = useState('');
    const [email, setEmail] = useState('');
    const [userphotoURL, setUserPhotoURL] = useState('');

    const [loading, setLoading] = useState(false);

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
        var fileName = '';
        if (filename.split('_').pop().length > 40 ) {
            fileName = filename.split("_").pop().substring(0, 40) + '....'
        } else {
            fileName = filename.split("_").pop()
        }
        
        // Saved in Database about the User
        const uploadData = {
            fileName,
            to: email,
            from: userId,
            url: filePath,
            senders_photoURL: userphotoURL,
            senders_email: sendersEmail
        }

        axios.post(`https://evencloud.herokuapp.com/api/v1/readwrite`, uploadData)
            .then((res) => {
                console.log(res.status)
                if (res.status === 200) {
                    setLoading(true);
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
                <div className="ui hidden divider"></div>


                {
                    loading ? (
                        <Messages msg={'Successfully Shared'} />
                    ) : null
                }
                <div className="ui hidden divider"></div>

                <center>
                    <div className="ui card">
                        <div className="content">
                            <div>{filename}</div>

                            <div className="meta">Uploaded On: {uploaded}</div>
                            <div className="description">
                            </div>
                        </div>
                    </div>
                </center>

                <div className="ui hidden divider"></div>

                <div className="ui action input">
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email Address" />
                    <button onClick={() => share()} className="ui green icon button">
                        <i className="share icon"></i>
                        Share
                    </button>
                </div>
            </div>
        </Fragment>
    )
}

export default Share