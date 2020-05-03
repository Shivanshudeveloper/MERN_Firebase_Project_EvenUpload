import React, { useState, useEffect, Fragment } from 'react';
// Firebase
import { database } from '../Firebase/index';

import { Link } from 'react-router-dom';

var imageResponsive = {
    width: 'auto',
    height: '150px',
    fontSize: '1rem'
}

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



const AllPhotos = ({ data }) => {
    const [file, setFile] = useState({});
    const [file_path, setFilePath] = useState('');

    useEffect(() => {
        var starCountRef = database.ref(`${data}`);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            var fileName = fileData.fileName;
            var fileExtension = fileName.split('.').pop();
            if (fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg') {
                setFile(fileData);
                setFilePath(fileData.filePath);
            }
        });
}, []);

    
                    
    
    return (
        <Fragment>
            {
                file_path !== '' ? (
                    <div className="column">
                        <div className="ui rounded image">
                            <a href={file_path} download target="_blank">
                                <img style={imageResponsive} src={file_path} />
                            </a>
                        </div>
                    </div>
                ) : null
            }
            
        </Fragment>
    )
}

                            

export default AllPhotos
