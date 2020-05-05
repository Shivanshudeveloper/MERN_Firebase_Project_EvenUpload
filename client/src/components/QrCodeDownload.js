import React, { useState, useEffect, Fragment } from 'react';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Firebase
import { database } from '../Firebase/index';

// Loading
import loader from '../utils/loading.gif';

// Components
import QrCodeWatchChange from './QrCodeWatchChange';

const QrCodeDownload = () => {
    const [qrcode, setQrcode] = useState('');
    const [loading, setLoading] = useState(0);
    const [filePath, setFilePath] = useState('');

    // Unique ID
    var uuid = uuidv4();
    // Timestamp
    var d = new Date();
    var n = d.getTime();
    var id = uuid + n;

    useEffect(() => {
        // Save data in Database
        QRCode.toDataURL(id, function (err, data) {
            database.ref(`qr/${id}/`).set({
                filePath: ''
            }).then(() => {
                setQrcode(data);
                setLoading(1);
            })
            .catch(err => console.log(err));
        });


    }, []);

    

    return (
        <div>
            <Fragment>
                <center>
                    {
                        loading !== 0 ? (
                            <div>
                                <img className="ui medium image" src={qrcode} />
                                <div className="ui hidden divider"></div>
                            </div>
                        ) : (
                            <div>
                                <img src={loader} className="mt-4" />
                                <p>Loading QR Code</p>
                            </div>
                        )
                    }
                    <QrCodeWatchChange id={`qr/${id}/`} />
                </center>
            </Fragment>
        </div>
    )
}

export default QrCodeDownload
