import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <div className="ui text container">
            <div className="ui two item stackable tabs menu">
                <Link to="/home" className="item">
                    <i className="cloud blue icon"></i>
                    All Files
                </Link>
                <Link className="item">
                    <i className="folder yellow icon"></i>
                    Group
                </Link>
            </div>
        </div>
    )
}

export default Menu
