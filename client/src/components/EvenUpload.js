import React, { Fragment } from 'react';
import FileUpload from "./FileUpload";
// Components
import User from "./User";

const EvenUpload = () => {
    return (
        <Fragment>
            <div className="container">
                <User />
                <h1 className="text-center mt-4 font-weight-bold">
                Even<span className="text-primary" >Upload</span> <i className="fas fa-star text-warning"></i>
                </h1>

                <FileUpload />
            </div>
        </Fragment>
    )
}

export default EvenUpload
