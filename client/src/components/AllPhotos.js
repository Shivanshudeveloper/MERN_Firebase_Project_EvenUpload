import React, { useState, useEffect, Fragment } from 'react';
import { Player } from 'video-react';
import "video-react/dist/video-react.css"

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
    const [file_key, setFileKey] = useState('');

    useEffect(() => {
        var starCountRef = database.ref(`${data}`);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            var fileName = fileData.fileName;
            var fileExtension = fileName.split('.').pop();
            if (fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg') {
                setFile(fileData);
                setFilePath(fileData.filePath);
                setFileKey(file_key);
            }
            // if (fileExtension === 'mp4') {
            //     setFile(fileData);
            //     setFilePath(fileData.filePath);
            //     setFileKey(fileData.fileKey);
            // }
        });
}, []);

    
                    
    
    return (
        <Fragment>
            {
                file_path !== '' ? (
                    <>
                        <div className="column">
                            <div className="ui rounded image">
                                <a href={file_path} download target="_blank">
                                    <img style={imageResponsive} src={file_path} />
                                </a>
                            </div>
                        </div>
                        
                        {/* <Player
                            playsInline
                            src={`https://storage.googleapis.com/evencloud-26d32.appspot.com/uploads/${file_key}`}
                        /> */}
                    </>
                ) : null
            }
            
        </Fragment>
    )
}

                            

export default AllPhotos
