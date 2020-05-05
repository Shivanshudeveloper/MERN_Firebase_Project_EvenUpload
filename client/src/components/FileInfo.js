import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import QRCode from 'qrcode';
import {
    BrowserView,
    MobileView
  } from 'react-device-detect';

// Loading
import loading from '../utils/loading.gif';

// Firebase
import { database } from '../Firebase/index';
// Components
import User from './User';
import Menu from './Menu';
// @From Mobile
import MobileMenu from './MobileView/Menu';


const FileTrim = ({ filename }) => {
    return (
        <div className="ui medium header">
            {filename.split("_").pop().substring(0, 40)}....
        </div>
    )
}

const FileNotTrim = ({ filename }) => {
    return (
        <div className="ui medium header">
            {filename.split("_").pop()}
        </div>
    )
}


const FileInfo = ({ location }) => {
    const [filename, setFileName] = useState('');
    const [fileId, setFileId] = useState('');
    const [file, setFile] = useState({});
    const [qrcode, setQrcode] = useState('');

    useEffect(() => {
        const { name, fileId } = queryString.parse(location.search);
        setFileName(name);
        setFileId(fileId);

        var starCountRef = database.ref(fileId);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            setFile(fileData);

            var path = fileData.filePath;
            QRCode.toDataURL(`${path}`, function (err, url) {
                setQrcode(url);
            });
        });

        
    }, []);

    

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

                    <div style={{marginTop: '5%'}}>
                        { filename.split('_').pop().length > 40 ? (
                            <FileTrim filename={filename} />
                        ) : (
                            <FileNotTrim filename={filename} />
                        ) }
                    </div>
                    <div className="ui hidden divider"></div>
                    <center className="mt-2">
                        {
                            qrcode ? (
                                <div>
                                    <img className="text-center" src={qrcode} />
                                    <br />
                                    <button className="ui button">
                                        Share
                                    </button>
                                    <div className="ui hidden divider"></div>
                                </div>
                            ) : (
                                <div>
                                    <img src={loading} className="mt-4" />
                                    <p>Loading QR Code</p>
                                </div>
                            )
                        }
                        
                    </center>

                    <center>
                        {
                            qrcode ? (
                                <a href={file.filePath} className="ui primary button" target="_blank" download>
                                    <i className="fas fa-download"></i> Download File
                                </a>
                            ) : null
                        }
                        
                    </center>
                    
                    


                    

            </div>
        </Fragment>
    )
}

export default FileInfo