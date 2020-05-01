import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import QRCode from 'qrcode';
// Loading
import loading from '../utils/loading.gif';

// Firebase
import { database } from '../Firebase/index';
// Components
import User from "./User";

const FileTrim = ({ filename }) => {
    return (
        <div className="text-center">
            {filename.split("_").pop().substring(0, 20)}....
        </div>
    )
}

const FileNotTrim = ({ filename }) => {
    return (
        <div className="text-center">
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
            <div className="container">
                <User />
                <h1 className="text-center mt-4 font-weight-bold">
                    Even<span className="text-primary" >Upload</span> <i className="fas text-primary fa-cloud"></i>
                </h1>
                <div className="mt-4 display-4 text-center">
                    <a href={file.filePath}>
                        <i className="fas text-primary fa-file-alt"></i>
                    </a>
                </div>


                    { filename.split('_').pop().length > 20 ? (
                        <FileTrim filename={filename} />
                    ) : (
                        <FileNotTrim filename={filename} />
                    ) }
                    
                    <center className="mt-2">
                        {
                            qrcode ? (
                                <div>
                                    <img className="text-center" src={qrcode} /> 
                                    <p>Share</p>
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
                                <a href={file.filePath} className="btn text-light btn-primary mt-4" download="download">
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