import React, { useState, useEffect, Fragment } from 'react';
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
        <Fragment>
            <div className="ui grid">
                <div className="four wide column">
                    <a onClick={() => window.location = "/home"} className="item">
                        <i className="large home blue icon"></i>
                        <br />
                        Home
                    </a>
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
                    <Link to="/scan" className="item">
                        <i className="large black expand icon"></i>
                        <br />
                        Scan
                    </Link>
                </div>
                <div id="sidebarBtn" className="four wide column">
                    <a href="#!" className="item">
                        <i className="large grey align justify icon"></i>
                        <br />
                        More
                    </a>
                </div>
            </div>
            <div className="ui sidebar inverted vertical menu">
                <a className="item" href="/home" >
                    EvenCloud
                </a>
                <a className="item">
                    <Link to="/photos" className="item">
                        Photos
                    </Link>
                </a>
                <a className="item">
                    <a className="item" href="/filetrack" >
                        File Management
                    </a>
                </a>
            </div>
        </Fragment>
    )
}

export default Menu
