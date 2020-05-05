import React, { useState, useEffect, Fragment } from 'react';
// Firebase
import { database } from '../Firebase/index';

import { Link } from 'react-router-dom';

const FileTrim = ({ file_name }) => {
    return (
        <div>
            {file_name.split("_").pop().substring(0, 40)}....
        </div>
    )
}

const FileNotTrim = ({ file_name }) => {
    return (
        <div>
            {file_name.split("_").pop()}
        </div>
    )
}



const File = ({ data }) => {
    const [file, setFile] = useState({});
    const [file_name, setFileName] = useState('');
    const [file_path, setFilePath] = useState('');


    useEffect(() => {
        var starCountRef = database.ref(`${data}`);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            setFile(fileData);
            setFileName(fileData.fileName);
            setFilePath(fileData.filePath);
        });
}, []);

    
                    
    
    return (
        <Fragment>
            <div role="listitem" className="item">
                <i aria-hidden="true" className="file alternate big icon blue aligned"></i>
                <div className="content">
                    <Link className="header" to={`/fileinfo?name=${file_name}&fileId=${data}`}>
                        { file_name.split('_').pop().length > 40 ? (
                            <FileTrim file_name={file_name} />
                        ) : (
                            <FileNotTrim file_name={file_name} />
                        ) }
                    </Link>

                    <div className="ui right aligned">
                        <Link className="right floated" to={`/scanqrdownload/?path=${data}`}>
                            <i className="large share icon"></i>
                            <br />
                        </Link>
                        
                        <a href={file.filePath} className="right floated" target="_blank" download>
                            <i class="large grey download icon"></i>
                            <br />
                        </a>
                    </div>
                    
                        
                    <a style={{marginTop: '2px'}} className="description">{`Uploaded on ${file.date}`}</a>
                </div>
            </div>
            
        </Fragment>
    )
}



export default File
