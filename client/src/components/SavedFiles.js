import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
    BrowserView,
    MobileView
} from 'react-device-detect';
import queryString from 'query-string';

// Components
import Menu from './Menu';
import MobileMenu from './MobileView/Menu';
import User from './User';

// API Service
import { API_SERVICE } from '../config/URI';

const AllFileList = ({ file }) => {
    return (
        <Fragment>
           <div className="ui fluid card">
                <div className="content">
                <div className="header">{file.file}</div>
                    <div className="description">
                        <a href={file.url} target="_blank" class="ui primary button">
                            <i className="cloud download icon"></i>
                            Download File
                        </a>
                    </div>
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
        
        axios.get(`${API_SERVICE}/api/v1/readwrite/savefiles/${userId}/${s}`)
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
