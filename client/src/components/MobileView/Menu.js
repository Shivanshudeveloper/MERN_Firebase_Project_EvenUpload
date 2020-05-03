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
            <div className="four wide column">
                <Link to="/home" className="item">
                    <i className="large cloud blue icon"></i>
                    Files
                </Link>
            </div>
            <div className="four wide column">
                <Link to="#!" className="item">
                    <i className="large folder yellow icon"></i>
                    Group
                </Link>
            </div>
            <div className="four wide column">
                <Link to="/photos" className="item">
                    <i className="large file purple image icon"></i>
                    Photos
                </Link>
            </div>
            <div className="four wide column">
                <Link to="/scan" className="item">
                    <i className="large folder black qrcode icon"></i>
                    Scan
                </Link>
            </div>
        </div>
    )
}

export default Menu
