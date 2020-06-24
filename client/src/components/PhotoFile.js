import React, { useState, useEffect, Fragment } from 'react';
// Firebase
import { database } from '../Firebase/index';


const PhotoFile = ({ data }) => {

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
                file_extension === 'png' || file_extension === 'jpeg' || file_extension === 'jpg' || file_extension === 'PNG' || file_extension === 'JEPEG' || file_extension === 'JPG' ? (
                    
                    <div style={{marginLeft: '20px'}} class="ui tiny image">
                        <img src={file_path} />
                    </div>
                    
                ) : null
            }
            
        </Fragment>
    )
}

export default PhotoFile;
