import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import CryptoJS from 'crypto';
import axios from 'axios';

import {
    BrowserView,
    MobileView
  } from 'react-device-detect';

// Component
import Menu from './Menu';
import MenuMobile from './MobileView/Menu';
import User from './User';
// API Service
import { API_SERVICE, SECRET_KEY } from '../config/URI';

const FileTrackList = ({ file }) => {
    return (
        <>  
            <div className="ui card fluid">
                <div className="content">
                    <img className="right floated mini ui circular image" src={file.userPhotoUrl} />
                <div className="header">
                    {file.userName}
                </div>
                <div className="meta">
                    {file.uploadedAt}
                </div>
                <div style={{ wordWrap: 'break-word' }} className="description">
                    {file.comments}
                </div>
                </div>
                <div className="extra content">
                    <a className="ui violet button" target="_blank" href={file.filePath}>
                        Download This File
                    </a>
                </div>
            </div>
            <i className="arrow large green alternate circle down icon"></i>
        </>
    )
}

const ProjectFileTrack = ({ location }) => {

    const [fileName, setFileName] = useState('');
    const [projectId, setProjectId] = useState('');
    const [fileDownload, setFileDownload] = useState('');
    const [files, setFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(true);

    let history = useHistory();

    useEffect(() => {
        const { f, p, d } = queryString.parse(location.search);
        // Getting the userid from JS session
        let userId = sessionStorage.getItem("userId"); 

        var mykey = CryptoJS.createDecipher('aes-128-cbc', SECRET_KEY);
        var dE = mykey.update(f, 'hex', 'utf8');
        dE += mykey.final('utf8');
        setFileName(dE);
        // 
        var mykey2 = CryptoJS.createDecipher('aes-128-cbc', SECRET_KEY);
        var dE2 = mykey2.update(p, 'hex', 'utf8');
        dE2 += mykey2.final('utf8');
        setProjectId(dE2);
        //
        var mykeyd = CryptoJS.createDecipher('aes-128-cbc', SECRET_KEY);
        var dEd = mykeyd.update(d, 'hex', 'utf8');
        dEd += mykeyd.final('utf8');
        setFileDownload(dEd);
        

        axios.get(`${API_SERVICE}/api/v1/readwrite/allfiletrack/${dE2}/${userId}/${dE}`)
        .then(response => {
            setFiles(response.data);
            setLoadingFiles(false);
        })

    }, []);

    const showFileTrackList = () => {
        return files.map(file => {
            return <FileTrackList file={file} key={file._id} />
        })
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
                    <MenuMobile />
                </MobileView>
                <div className="ui hidden divider"></div>
            </div>
            
            {
                loadingFiles ? (
                    <div className="ui center aligned container text">
                        <div className="ui fluid placeholder">
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="ui text aligned container">
                        
                        <div className="ui hidden divider"></div>

                        <a href={fileDownload} target="_blank" className="ui primary fluid button large">
                            <i className="cloud download icon"></i>
                            Download Latest Version
                        </a>
                        {showFileTrackList()}
                    </div>
                )
            }

            

            
        </Fragment>
    )
}

export default ProjectFileTrack;
