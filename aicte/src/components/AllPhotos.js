import React, { useState, useEffect, Fragment } from 'react';
// Firebase
import { database } from '../Firebase/index';

var imageResponsive = {
    width: 'auto',
    height: '150px',
    fontSize: '1rem',
    borderRadius: '5px'
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
