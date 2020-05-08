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
import { storage, database } from '../Firebase/index';
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

    // By Google Cloud Storage Public URL
    const [publicURL, setPublicURL] = useState('');

    useEffect(() => {
        const { name, fileId } = queryString.parse(location.search);
        setFileName(name);
        setFileId(fileId);

        var publicSharingURL = `https://storage.googleapis.com/aicte-admin-survey.appspot.com/uploads/${name}`;
        var dynamicLinkApi = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyCVVlRXx3gRLIs6LiBlWAQuq9UjSUnb5Ms`;

        // Make a Request to Firebase Dynamic Links for the URL
        axios.post(dynamicLinkApi, {
            longDynamicLink: `https://evencloud.page.link/?link=${publicSharingURL}`
        }).then((res) => {
            setPublicURL(res.data.shortLink);
        })


        var starCountRef = database.ref(fileId);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            setFile(fileData);

            var path = fileData.filePath;
            setFilePath(path);


            var gsReference = storage.refFromURL('gs://aicte-admin-survey.appspot.com/uploads/uploads/109e2440-98f6-4836-8270-739b836415a5_46564.jpg')
            
            console.log(gsReference);

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
                            Scan QR
                        </Link>
                        <Link className="ui primary button" to={`/share?name=${filename}&fileId=${fileId}`}>
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