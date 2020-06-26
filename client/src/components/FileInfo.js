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

                {
                    qrcode ? (
                            <div style={{marginTop: '15px'}}>
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
                            Link Copied
                        </div>
                    ) : null
                }

                <div className="ui segment">
                    <MobileView>
                        <div className="ui hidden divider"></div>
                    </MobileView>
                    <div className="ui two column stackable center aligned grid">
                        <center>
                            <i className="lock green icon"></i> End to End - Encrypted
                        </center>
                        <div className="middle aligned row">
                        <div className="column">
                            {
                                qrcode ? (
                                    <div>
                                        <img className="text-center" src={qrcode} />
                                    </div>
                                ) : (
                                    <div className="ui active inverted dimmer">
                                        <div className="ui medium text loader">Generating QR Code</div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="column">
                            <div>
                                {
                                    qrcode ? (
                                    <>
                                    <div className="ui icon header">
                                        { filename.split('_').pop().length > 40 ? (
                                            <>
                                            <FileTrim filename={filename} /> 
                                            </>
                                        ) : (
                                            <>
                                            <FileNotTrim filename={filename} /> 
                                            </>
                                        ) }
                                    </div>
                                        <BrowserView>
                                            <a href={publicURL} className="ui primary button" target="_blank" download>
                                                <i className="download icon"></i>
                                                Download File
                                            </a>
                                        </BrowserView>
                                        <MobileView>
                                            <a href={publicURL} className="ui primary fluid button" target="_blank" download>
                                                <i className="download icon"></i>
                                                Download File
                                            </a>
                                        </MobileView>
                                    </>
                                    ) : null
                                }
                                <div style={{marginTop: '20px'}}>
                                    <BrowserView>
                                        <Link to={`/scanqrdownload/?path=${fileId}&key=${file_key}`}>
                                            <i className="qrcode black big icon"></i> 
                                            <span className="medium"> Scan & Share File </span>
                                        </Link>
                                        <Link style={{marginLeft: '10px'}} to={`/share?name=${filename}&fileId=${fileId}&key=${file_key}`}>
                                            <i className="share green big alternate icon"></i>
                                            <span className="medium">Share File </span>
                                        </Link>
                                    </BrowserView>

                                    <MobileView>
                                        <Link to={`/scanqrdownload/?path=${fileId}&key=${file_key}`}>
                                            <i className="qrcode black big icon"></i> 
                                        </Link>
                                        <Link style={{marginLeft: '20px'}} to={`/share?name=${filename}&fileId=${fileId}&key=${file_key}`}>
                                            <i className="share blue big alternate icon"></i>
                                        </Link>
                                        <a style={{marginLeft: '20px'}} href={`whatsapp://send?text=${publicURL}`} data-action="share/whatsapp/share">
                                            <i className="whatsapp green big icon"></i>
                                        </a>
                                    </MobileView>
                                </div>
                                
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="ui hidden divider"></div>
                </div>

                <h1 className="ui header left aligned">Questions You May Have ?</h1>
                <div className="ui segment left aligned">
                    <h4>
                        <Link to={`/filesharedwith?n=${filename}`}>
                            File shared with people ?
                        </Link>
                    </h4>
                </div>

                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
            </div>
        </Fragment>
    )
}

export default FileInfo