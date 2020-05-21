import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    BrowserView,
    MobileView
} from 'react-device-detect';

// Components
import Menu from './Menu';
import MobileMenu from './MobileView/Menu';
import User from './User';

// API Service
import { API_SERVICE } from '../config/URI';

const AllFileContactList = ({ file }) => {
    return (
        <Fragment>
            <div className="ui raised link card green">
                    <div className="content">
                        <Link to={`/savedfiles?s=${file.senders_email}`}>
                            <img className="ui avatar image" src={file.senders_photo} /> {file.senders_email}
                        </Link>
                    </div>
            </div>
        </Fragment>
    )
}


const AllSaveFiles = () => {
    const userId = sessionStorage.getItem("userId");
    const [loading, setLoading] = useState(true);
    const [allSavedFiles, setAllSavedFiles] = useState([]);

    useEffect(() => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/savefiles/${userId}`)
        .then(response => {
            setAllSavedFiles(response.data);
            setLoading(false);
        })
    }, [])

    const showAllFiles = () => {
        return allSavedFiles.map(file => {
            return <AllFileContactList file={file} key={file._id} />
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

                {
                    loading ? (
                    <>
                        <div className="ui fluid placeholder">
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
                        <div className="ui two stackable cards">
                            {showAllFiles()}
                        </div>
                    )
                }

                
            </div>
        </Fragment>
    )
}

export default AllSaveFiles
