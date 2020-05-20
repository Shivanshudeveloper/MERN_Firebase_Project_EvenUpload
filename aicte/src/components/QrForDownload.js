import React, { useState ,useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../Firebase/index';
import {
    BrowserView,
    MobileView
} from 'react-device-detect';

// Components
import QrCodeDownload from './QrCodeDownload';
import User from './User';
import Menu from './Menu';
import MobileMenu from './MobileView/Menu';

const QrForDownload = () => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUserLoggedIn(true);
            } else {
                setUserLoggedIn(false);
            }
        });
    }, []);

    return (
        <div>
            <Fragment>
            
                <div className="ui center aligned container">
                    {
                        !userLoggedIn ? (
                            <h1 style={{marginTop: '10px'}} className="ui huge header center aligned grid">
                                Even<span className="ui blue header">Upload <i className="fas fa-cloud"></i></span>
                            </h1>
                        )  : null
                    }
                    
                    

                    <div className="ui hidden divider"></div>

                    {
                        userLoggedIn ? (
                            <div>    
                                <User />
                                <div className="ui hidden divider"></div>
                                <BrowserView>
                                    <Menu />
                                </BrowserView>
                                <MobileView>
                                    <MobileMenu />
                                </MobileView>
                            </div>
                        ) : (
                            <Link className="ui button" to='/'>
                                <i className="sign-in icon"></i>
                                Back to Login
                            </Link>
                        )
                    }
                    

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
