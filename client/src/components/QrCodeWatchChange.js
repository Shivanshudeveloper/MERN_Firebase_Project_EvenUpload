import React, { useState, useEffect, Fragment } from 'react';

// Firebase
import { database } from '../Firebase/index';

const QrCodeWatchChange = ({ id }) => {

    const [uid, setUid] = useState(id);
    const [filerender, setFileRender] = useState('');
    const [fileName, setFileName] = useState('');
    const [allData, setAllData] = useState({});


    useEffect(() => {
        database.ref(`${uid}`).once('value', function(snapshot) {
            var filePath = snapshot.val();
            var allData = filePath;
            setAllData(allData);
            setFileRender(allData.filePath);
            setFileName(allData.fileName);
        });
    });

    

    return (
        <div>
            {
                filerender !== '' ? (
                    <>  
                        <h3>{fileName}</h3>
                        <a className="ui green button" href={filerender} target="_blank">
                            <i className="cloud download icon"></i>
                            File Ready to Download
                        </a>
                        <div className="ui hidden divider"></div>
                    </>
                ) : null
            }
        </div>
    )
}

export default QrCodeWatchChange
