import React, { useState, useEffect, Fragment } from 'react';
// Firebase
import { database } from '../Firebase/index';

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
            <a href={file.filePath} className="list-group-item list-group-item-action">
            { file_name.split('_').pop().length > 20 ? (
                <FileTrim file_name={file_name} />
            ) : (
                <FileNotTrim file_name={file_name} />
            ) }
            
            </a>
        </Fragment>
    )
}

export default File
