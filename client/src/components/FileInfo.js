import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import QRCode from 'qrcode';
import {
    BrowserView,
    MobileView
  } from 'react-device-detect';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';

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
    const [filePath, setFilePath] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const { name, fileId } = queryString.parse(location.search);
        setFileName(name);
        setFileId(fileId);

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
                    
                    
                    <div className="ui buttons">
                        <Link className="ui button secondary" to={`/scanqrdownload/?path=${fileId}`}>
                            <i class="qrcode icon"></i>
                            Scan QR Code
                        </Link>
                        <Link className="ui button" to={`/share?name=${filename}&fileId=${fileId}`}>
                            <i className="share alternate icon"></i>
                            Share to Contacts
                        </Link>
                    </div>
                    
                    



                    <div className="ui hidden divider"></div>
                    
                    {
                        qrcode ? (
                                <div>
                                <CopyToClipboard text={filePath}
                                        onCopy={() => copy()}>
                                        <div className="ui action input">
                                            <input type="text" value={filePath} />
                                            
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
                                <a href={file.filePath} className="ui primary button" target="_blank" download>
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