import React, { useState, useEffect, Fragment } from 'react';
// Firebase
import { auth, database } from '../../Firebase/index';

// Utils
import no_files from '../../utils/no_files.png';

// Components
import Menu from './Menu';
import Messages from "../Messages";
import AllPhotos from "./AllPhotos";
import User from '../User';


const Photos = () => {
    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 

    const [message, setMessage] = useState('');
    const [allData, setAllData] = useState({});
    const [user, setUser] = useState({});

    // Loading for uploading the file
    const [loading, setLoading] = useState(0);
    // Loading for loading all the files from server
    const [loadingdata, setLoadingData] = useState(0);
    


    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUser(user);
            } else {
                console.log("No");
            }
        });
    }, []);

    useEffect(() => {
        database.ref(`files/${userId}`).once('value', function(snapshot) {
            setAllData(snapshot.val());
            setLoadingData(1);
        });
    });
    
    return (
        <Fragment>
            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>
                <Menu />

                { message ? <Messages msg={message} /> : null }
                
                
                <div style={{marginTop: '4%'}} className="ui left aligned container">
                {
                    loadingdata === 0 ? (
                        <div className="ui fluid placeholder">
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="ui two column grid">
                            { allData ? (
                                (Object.keys(allData)).map((data) => (
                                    <AllPhotos key={data} data={`files/${userId}/${data}`} />
                                ))
                            ) : 
                            <center>
                                <img className="ui large image" src={no_files} />
                            </center>
                            }
                        </div>
                    )
                }
                    
                </div>
            </div>
        </Fragment>
    )
}

export default Photos
