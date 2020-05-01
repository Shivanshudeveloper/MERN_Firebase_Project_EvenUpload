import React, { Fragment } from 'react';
import FileUpload from "./FileUpload";
// Components
import User from "./User";

const EvenUpload = () => {
    return (
        <Fragment>
            <div className="container">
                <User />
                <h1 className="mt-4 font-weight-bold float-left">
                    Even<span className="text-primary" >Upload</span> <i className="fas text-primary fa-cloud"></i>
                </h1>

                <FileUpload />
            </div>
        </Fragment>
    )
}

export default EvenUpload
