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
            <div className="ui three item stackable tabs menu">
                <Link to="/home" className="item">
                    <i className="cloud blue icon"></i>
                    All Files
                </Link>
                <Link to="#!" className="item">
                    <i className="folder yellow icon"></i>
                    Group
                </Link>
                <Link to="/scan" className="item">
                    <i className="folder black qrcode icon"></i>
                    Scan
                </Link>
            </div>
        </div>
    )
}

export default Menu
