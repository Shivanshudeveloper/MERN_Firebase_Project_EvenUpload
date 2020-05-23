import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
    BrowserView,
    MobileView
} from 'react-device-detect';
import queryString from 'query-string';
import CryptoJS from 'crypto';

// Components
import Menu from './Menu';
import MobileMenu from './MobileView/Menu';
import User from './User';

// API Service
import { API_SERVICE, SECRET_KEY } from '../config/URI';

const AllFileList = ({ file }) => {
    var fileName = file.file;
    return (
        <Fragment>
            <div className="ui card fluid">
                <div className="content">
                    <div className="header">
                        {fileName}
                    </div>
                    <a href={file.url} target="_blank">
                    <i className="cloud download icon"></i>
                        Download File
                    </a>
                </div>
            </div>
        </Fragment>
    )
}


const SavedFiles = ({ location }) => {
    const userId = sessionStorage.getItem("userId");
    const [allSavedFiles, setAllSavedFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { s } = queryString.parse(location.search);

        var mykey = CryptoJS.createDecipher('aes-128-cbc', SECRET_KEY);
        var dE = mykey.update(s, 'hex', 'utf8');
        dE += mykey.final('utf8');
        
        axios.get(`${API_SERVICE}/api/v1/readwrite/savefiles/${userId}/${dE}`)
        .then(response => {
            setAllSavedFiles(response.data);
            setLoading(false);
        })
    }, [])

    const showAllFiles = () => {
        return allSavedFiles.map(file => {
            return <AllFileList file={file} key={file._id}  />
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
                        <>
                            {showAllFiles()}    
                        </>  
                    )
                }
            </div>
        </Fragment>
    )
}

export default SavedFiles
