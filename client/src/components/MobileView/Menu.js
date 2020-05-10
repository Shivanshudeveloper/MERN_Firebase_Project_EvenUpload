import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// API Service
import { API_SERVICE } from '../../config/URI';

const Menu = () => {

    // Getting the userid from JS session
    let sendersEmail = sessionStorage.getItem("userEmail"); 

    const [inboxCount, setInboxCount] = useState([]);

    useEffect(() => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/inbox/${sendersEmail}`)
        .then(response => {
            setInboxCount(response.data)
        })
    }, [])


    return (
        <div className="ui grid">
            <div className="four wide column">
                <Link to="/home" className="item">
                    <i className="large home blue icon"></i>
                    <br />
                    Files
                </Link>
            </div>
            <div className="four wide column">
                <Link to="/inbox" className="item">
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
                    <i className="large inbox red icon"></i>
                    <br />
                    Inbox
                </Link>
            </div>
            {/* <div className="four wide column">
                <Link to="/contacts" className="item">
                    <i class="large users yellow icon"></i>
                    <br />
                    Share
                </Link>
            </div> */}
            <div className="four wide column">
                <Link to="/photos" className="item">
                    <i className="large file purple image icon"></i>
                    <br />
                    Photos
                </Link>
            </div>
            <div className="four wide column">
                <Link to="/scan" className="item">
                    <i className="large folder black qrcode icon"></i>
                    <br />
                    Scan
                </Link>
            </div>
        </div>
    )
}

export default Menu
