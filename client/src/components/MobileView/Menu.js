import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {

    const handleScan = data => {
        if (data) {
          console.log(data)
        }
    }


    return (
        <div className="ui grid">
            <div className="five wide column">
                <Link to="/home" className="item">
                    <i className="large home blue icon"></i>
                    <br />
                    Files
                </Link>
            </div>
            <div className="five wide column">
                <Link to="/contacts" className="item">
                    <i class="large users yellow icon"></i>
                    <br />
                    Share
                </Link>
            </div>
            <div className="five wide column">
                <Link to="/photos" className="item">
                    <i className="large file purple image icon"></i>
                    <br />
                    Photos
                </Link>
            </div>
            <div className="five wide column">
                <Link to="#!" className="item">
                    <i className="large inbox red icon"></i>
                    <br />
                    Inbox
                </Link>
            </div>
            <div className="five wide column">
                <Link to="/scan" className="item">
                    <i className="large folder black qrcode icon"></i>
                    <br />
                    Scan
                </Link>
            </div>
        </div>
    )
}

export default Menu
