import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

// Components
import QrCodeDownload from './QrCodeDownload';
const QrForDownload = () => {
    return (
        <div>
            <Fragment>
            
                <div className="ui center aligned container">
                    <h1 style={{marginTop: '10px'}} className="ui huge header center aligned grid">
                        Even<span className="ui blue header">Upload <i className="fas fa-cloud"></i></span>
                    </h1>
                    <div className="ui hidden divider"></div>
                    <Link className="ui button" to='/'>
                        <i className="sign-in icon"></i>
                        Back to Login
                    </Link>
                    <div className="ui huge header">
                        Scan QR Code for Download
                    </div>

                    <QrCodeDownload />
                </div>
            </Fragment>
        </div>
    )
}

export default QrForDownload
