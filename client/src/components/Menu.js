import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {

    const handleScan = data => {
        if (data) {
          console.log(data)
        }
    }


    return (
        <div className="ui text container">
            <div className="ui four item stackable tabs menu">
                <Link to="/home" className="item">
                    <i className="home blue icon"></i>
                    All Files
                </Link>
                <Link to="/inbox" className="item">
                    <i className="inbox red icon"></i>
                    Inbox
                </Link>
                {/* <Link to="/contacts" className="item">
                    <i className="users yellow icon"></i>
                    Contacts
                </Link> */}
                <Link to="/photos" className="item">
                    <i className="file purple image icon"></i>
                    Photos
                </Link>
                <Link to="/scan" className="item">
                    <i className="folder black qrcode icon"></i>
                    Scan & Download
                </Link>
            </div>
        </div>
    )
}

export default Menu
