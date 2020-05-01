import React, { useState, useEffect, Fragment } from 'react';
// Firebase
import { database } from '../Firebase/index';

import { Link } from 'react-router-dom';

const FileTrim = ({ file_name }) => {
    return (
        <div>
            <i className="fas fa-file text-primary mr-2"></i> {file_name.split("_").pop().substring(0, 20)}....
        </div>
    )
}

const FileNotTrim = ({ file_name }) => {
    return (
        <div>
            <i className="fas fa-file text-primary mr-2"></i> {file_name.split("_").pop()}
        </div>
    )
}



const File = ({ data }) => {
    const [file, setFile] = useState({});
    const [file_name, setFileName] = useState('');

    useEffect(() => {
        var starCountRef = database.ref(`${data}`);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            setFile(fileData);
            setFileName(fileData.fileName);
        });
}, []);

    

    
    return (
        <Fragment>
            <li className="list-group-item">
                <a href={file.filePath} className="float-right text-secondary" download="download">
                    <i className="fas fa-download"></i>
                </a>

                <Link to={`/fileinfo?name=${file_name}&fileId=${data}`}>
                    { file_name.split('_').pop().length > 20 ? (
                        <FileTrim file_name={file_name} />
                    ) : (
                        <FileNotTrim file_name={file_name} />
                    ) }
                </Link>
            </li>
        </Fragment>
    )
}

export default File
