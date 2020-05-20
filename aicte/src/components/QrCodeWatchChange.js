import React, { useState, useEffect, Fragment } from 'react';

// Firebase
import { database } from '../Firebase/index';

const QrCodeWatchChange = ({ id }) => {

    const [uid, setUid] = useState(id);
    const [filerender, setFileRender] = useState('');

    const [allData, setAllData] = useState({});

    useEffect(() => {
        database.ref(`${uid}`).once('value', function(snapshot) {
            var filePath = snapshot.val();
            var allData = filePath;
            console.log(allData.filePath);
            setAllData(allData);
            setFileRender(allData.filePath);
        });
    });

    return (
        <div>
            {
                filerender !== '' ? (
                    <a className="ui green button" href={filerender} target="_blank">
                        <i className="cloud download icon"></i>
                        Download
                    </a>
                ) : null
            }
        </div>
    )
}

export default QrCodeWatchChange
