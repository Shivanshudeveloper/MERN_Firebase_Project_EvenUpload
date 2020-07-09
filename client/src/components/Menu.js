import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// API Service
import { API_SERVICE } from '../config/URI';

const Menu = () => {
    // Getting the userid from JS session
    let sendersEmail = sessionStorage.getItem("userEmail"); 

    let [inboxCount, setInboxCount] = useState([]);

    useEffect(() => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/inbox/${sendersEmail}`)
        .then(response => {
            setInboxCount(response.data)
        })
    })

    return (
        <div className="ui text container">
            <div className="ui five item stackable tabs menu">
                <a onClick={() => window.location = "/home"} className="item">
                    <i className="home blue icon"></i>
                    Home
                </a>
                
                <Link to="/inbox" className="item">
                    <i className="inbox red icon"></i>
                    Inbox
                    {
                        inboxCount && inboxCount.length ? (
                                <>
                                    <div className="floating ui red label">{inboxCount[0].inbox}</div>
                                </>
                            ) : (
                                <>
                                    <div className="floating ui red label">0</div>
                                </>
                            )
                    }
                </Link>



                {/* <Link to="/contacts" className="item">
                    <i className="users yellow icon"></i>
                    Contacts
                </Link> */}
                <Link to="/photos" className="item">
                    <i className="file purple image icon"></i>
                    Photos
                </Link>
                <Link to="/scan" className="item">
                    <i className="yellow expand icon"></i>
                    Scan
                </Link>
                <a className="item" href="/filetrack" >
                    <i className="pink folder icon"></i>
                    File Management
                </a>
            </div>
        </div>
    )
}

export default Menu
