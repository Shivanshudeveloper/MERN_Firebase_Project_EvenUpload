import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import QRCode from 'qrcode';
import {
    BrowserView,
    MobileView
  } from 'react-device-detect';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Loading
import loading from '../utils/loading.gif';

// Firebase
import { database } from '../Firebase/index';
// Components
import User from './User';
import Menu from './Menu';
// @From Mobile
import MobileMenu from './MobileView/Menu';

// URI
import { DYNAMIC_LINK_KEY } from '../config/URI';


const FileTrim = ({ filename }) => {
    return (
        <div className="ui medium header">
            {filename.substring(0, 40)}....
        </div>
    )
}

const FileNotTrim = ({ filename }) => {
    return (
        <div className="ui medium header">
            {filename}
        </div>
    )
}


const FileInfo = ({ location }) => {
    const [filename, setFileName] = useState('');
    const [fileId, setFileId] = useState('');
    const [file, setFile] = useState({});
    const [qrcode, setQrcode] = useState('');
    const [filePath, setFilePath] = useState('');
    const [copied, setCopied] = useState(false);
    const [file_key, setFileKey] = useState('');

    // By Google Cloud Storage Public URL
    const [publicURL, setPublicURL] = useState('');

    useEffect(() => {
        const { name, fileId, key } = queryString.parse(location.search);
        setFileName(name);
        setFileId(fileId);
        setFileKey(key);

        var publicSharingURL = `https://storage.googleapis.com/evencloud-26d32.appspot.com/uploads/${key}`;
        var dynamicLinkApi = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${DYNAMIC_LINK_KEY}`;

        // Make a Request to Firebase Dynamic Links for the URL
        axios.post(dynamicLinkApi, {
            longDynamicLink: `https://evenupload.page.link/?link=${publicSharingURL}`
        }).then((res) => {
            setPublicURL(res.data.shortLink);
        })


        var starCountRef = database.ref(fileId);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            setFile(fileData);

            var path = fileData.filePath;
            setFilePath(path);


            QRCode.toDataURL(`${path}`, function (err, url) {
                setQrcode(url);
            });
        });

        
    }, []);

    const copy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

                    <div style={{marginTop: '5%'}}>
                        { filename.split('_').pop().length > 40 ? (
                            <FileTrim filename={filename} />
                        ) : (
                            <FileNotTrim filename={filename} />
                        ) }
                    </div>
                    <div className="ui hidden divider"></div>
                    
                    
                    <div className="ui buttons">
                        <Link className="ui button secondary" to={`/scanqrdownload/?path=${fileId}&key=${file_key}`}>
                            <i className="qrcode icon"></i>
                            Scan QR
                        </Link>
                        <Link className="ui primary button" to={`/share?name=${filename}&fileId=${fileId}&key=${file_key}`}>
                            <i className="share alternate icon"></i>
                            Share File
                        </Link>
                    </div>
                    



                    <div className="ui hidden divider"></div>
                    
                    {
                        qrcode ? (
                                <div>
                                <CopyToClipboard text={publicURL}
                                        onCopy={() => copy()}>
                                        <div className="ui action input">
                                            <input type="text" value={publicURL} />
                                            
                                            <button className="ui teal right labeled icon button">
                                                <i className="copy icon"></i>
                                                Copy
                                            </button>
                                        </div>
                                </CopyToClipboard>
                                
                                </div>
                                
                        ) : null
                    }
                    
                    {
                        copied ? (
                            <div className="ui pointing label">
                                Copied
                            </div>
                            
                        ) : null
                    }
                    
                
                    
                    
                    <center className="mt-2">
                        {
                            qrcode ? (
                                <div>
                                    <img className="text-center" src={qrcode} />
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
                                <a href={publicURL} className="ui green button" target="_blank" download>
                                    <i className="download icon"></i>
                                    Download File
                                </a>
                            ) : null
                        }
                        
                    </center>
                    
                    


                    

            </div>
        </Fragment>
    )
}

export default FileInfo