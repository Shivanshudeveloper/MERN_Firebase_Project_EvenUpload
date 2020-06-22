import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
    BrowserView,
    MobileView
} from 'react-device-detect';
import queryString from 'query-string';
// Components
import User from './User';
import Menu from './Menu';
// @From Mobile
import MobileMenu from './MobileView/Menu';

// API Service
import { API_SERVICE } from '../config/URI';

const AllSharedWith = ({ sharedwith }) => {
    var shareTo = sharedwith.to;
    var date = new Date(sharedwith.date);
    var sharedOnDate = date.getDate();
    var sharedOnMonth = date.getMonth();
    var sharedOnYear = date.getFullYear();

    return (
        <Fragment>
            <div className="ui raised link card violet fluid">
                <div className="content left aligned">
                    <i className="user icon"></i><strong> {shareTo} </strong>
                    <div className="description">Shared On {sharedOnDate + '/' + sharedOnMonth + '/' + sharedOnYear }</div>
                </div>
            </div>
        </Fragment>
    )
}


const FileSharedWith = ({ location }) => {
    const userId = sessionStorage.getItem("userId");

    const [allShared, setAllShared] = useState([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const { n } = queryString.parse(location.search);

        axios.get(`${API_SERVICE}/api/v1/readwrite/sharedwith/${userId}/${n}`)
        .then(response => {
            setAllShared(response.data);
            setLoading(false);
        })

    }, [])

    const showSharedWithPeople = () => {
        return allShared.map(sharedwith => {
            return <AllSharedWith sharedwith={sharedwith} key={sharedwith._id}  />
        })
    }

    return (
        <Fragment>
            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>
                <BrowserView>
                    <div className="ui hidden divider"></div>
                    <Menu />
                </BrowserView>

                <MobileView>
                    <MobileMenu />
                </MobileView>

                <div className="ui hidden divider"></div>
                <div className="ui text container">
                    {
                        loading ? (
                            <>
                                <div className="ui placeholder fluid">
                                    <div className="image header">
                                        <div className="line"></div>
                                        <div className="line"></div>
                                    </div>
                                </div>

                                <div className="ui placeholder fluid">
                                    <div className="image header">
                                        <div className="line"></div>
                                        <div className="line"></div>
                                    </div>
                                </div>

                                <div className="ui placeholder fluid">
                                    <div className="image header">
                                        <div className="line"></div>
                                        <div className="line"></div>
                                    </div>
                                </div>

                                <div className="ui placeholder fluid">
                                    <div className="image header">
                                        <div className="line"></div>
                                        <div className="line"></div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                    {showSharedWithPeople()}
                            </>
                        )
                    }
                </div>


                

            </div>
        </Fragment>
    )
}

export default FileSharedWith;
