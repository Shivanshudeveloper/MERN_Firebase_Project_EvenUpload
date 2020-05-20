import React, { Fragment } from 'react';
import FileUpload from './FileUpload';



// Components
import User from '../User';

const EvenUpload = () => {
    return (
        <Fragment>
            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>
                
                
                <FileUpload />
            </div>
        </Fragment>
    )
}

export default EvenUpload
