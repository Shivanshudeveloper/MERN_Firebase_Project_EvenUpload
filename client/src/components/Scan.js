import React, { Fragment } from 'react';

// Components
import User from "./User";
import QrcodeScanner from './QrcodeScanner';

const Scan = () => {
    return (
        <Fragment>
            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>
                <QrcodeScanner />

                
            </div>
        </Fragment>
    )
}

export default Scan