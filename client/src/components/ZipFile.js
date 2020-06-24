import React, { useState, useEffect, Fragment } from 'react';
// Firebase
import { database } from '../Firebase/index';

import { Link } from 'react-router-dom';

const FileTrim = ({ file_name }) => {
    return (
        <div style={{float: 'left'}} >
            <i aria-hidden="true" className="file archive brown big icon aligned"></i>{file_name.substring(0, 10)}....
        </div>
    )
}

const FileNotTrim = ({ file_name }) => {
    return (
        <div style={{float: 'left'}} >
            <i aria-hidden="true" className="file archive brown big icon aligned"></i>{file_name}
        </div>
    )
}

const ZipFile = ({ data }) => {

    const [file, setFile] = useState({});
    const [file_name, setFileName] = useState('');
    const [file_extension, setFileExtension] = useState('');
    const [file_path, setFilePath] = useState('');


    useEffect(() => {
        var starCountRef = database.ref(`${data}`);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            setFile(fileData);
            setFileName(fileData.fileName);
            setFilePath(fileData.filePath);
            var name = fileData.fileName;
            setFileExtension(name.split('.').pop());
        });
    }, []);

    return (
        <Fragment>
            {
                file_extension === 'zip' || file_extension === 'rar' || file_extension === '7z' || file_extension === 'tar' || file_extension === 'tar.gz' || file_extension === 'iso' || file_extension === 'gz' || file_extension === 'jar' || file_extension === 'bz' || file_extension === 'tgz' ? (
                    <div className="ui link card">
                        <div className="content">
                            <a href={file_path} target="_blank" download>
                            { 
                                file_name.length > 10 ? (
                                    <FileTrim file_name={file_name} />
                                ) : (
                                    <FileNotTrim file_name={file_name} />
                                ) 
                            }
                            </a>
                            <div className="meta">
                                <Link className="right floated" to={`/scanqrdownload/?path=${data}`}>
                                    <i className="large qrcode black icon"></i>
                                    <br />
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                ) : null
            }
            
        </Fragment>
    )
}

export default ZipFile;
