import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import axios from 'axios';


// Component
import Menu from './Menu';
import MenuMobile from './MobileView/Menu';
import User from './User';
// API Service
import { API_SERVICE, SECRET_KEY } from '../config/URI';


import {
    BrowserView,
    MobileView
  } from 'react-device-detect';

const ProjectSharedWithContact = ({ sharedwith }) => {
    var date = new Date(sharedwith.date);
    date = date.toDateString();
    return (
        <>
            <Fragment>
                <div className="ui raised link card violet fluid">
                    <div className="content left aligned">
                        <i className="user icon"></i><strong> {sharedwith.to} </strong>
                        <div className="description">Shared On {date}</div>
                    </div>
                </div>
                <i className="arrow alternate green circle down icon"></i>
            </Fragment>
        </>
    )
}

const ProjectSharedWith = ({ location }) => {

    const [projectSharedWith, setProjectSharedWith] = useState([]);

    useEffect(() => {
        // Getting the pid and project name from url
        const { pid } = queryString.parse(location.search);
        axios.get(`${API_SERVICE}/api/v1/readwrite/projectsharedwith/${pid}`)
        .then(response => {
            setProjectSharedWith(response.data);
        })
    }, []);

    const projectSharedWithContact = () => {
        return projectSharedWith.map(sharedwith => {
            return <ProjectSharedWithContact sharedwith={sharedwith} key={sharedwith._id} />
        })
    }

    return (
        <Fragment>
            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
                <BrowserView>
                    <Menu />
                </BrowserView>
                <MobileView>
                    <MenuMobile />
                </MobileView>
                <div className="ui hidden divider"></div>
            </div>
            <div className="ui aligned text container">
                { projectSharedWithContact() }
            </div>
        </Fragment>
    )
}

export default ProjectSharedWith
