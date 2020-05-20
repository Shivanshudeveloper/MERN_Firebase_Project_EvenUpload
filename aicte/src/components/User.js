import React, { useState, useEffect, Fragment } from 'react'
import { auth, firebase } from '../Firebase/index';

// For Desktop and Mobile Views
import {
    BrowserView,
    MobileView
} from 'react-device-detect';

const User = () => {
       

    const [user, setUser] = useState({});
    const [username, setName] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUser(user);
                setName(user.displayName);
            } else {
                console.log("No");
                window.location.href = "/";
            }
        });
    }, []);

    const signOut = () => {
        auth.signOut().then(function() {
            setUser({});
            sessionStorage.setItem("userId", "");
            window.location.href = "/";
        }).catch(function(error) {
            console.log(error);
        });
    }


    return (
        <Fragment>
        <br />
        <BrowserView>
            <div className="ui equal width grid">
                <div className="column">
                    {
                        !user.photoURL ? (
                            <div className="ui tiny header">
                                {user.email}
                            </div>
                        ) : (
                            <>
                                <img src={user.photoURL} className="ui avatar image"  />
                                    <span style={{marginLeft: '6px'}}>
                                        <strong> {user.email} </strong>
                                    </span>
                            </>
                        )
                    }
                </div>
                <div className="column">
                    <button onClick={() => signOut()} className="ui inverted red button">
                        Logout
                    </button> 
                </div>
            </div>
        </BrowserView>

        <MobileView>
            <div>
                <div style={{float: 'left'}}>
                    <button onClick={() => signOut()} className="ui circular google icon button">
                        <i className="red sign-out icon"></i>
                    </button> 
                </div>
                

                <div style={{float: 'right'}}>
                    {
                        !user.photoURL ? (
                            <div className="ui tiny header">
                                {user.email}
                            </div>
                        ) : (
                            <>
                                <img src={user.photoURL} className="ui avatar image"  />
                            </>
                        )
                    }
                </div>
            </div>
            <br />
            <br />
        </MobileView>
        </Fragment>
    )
}

export default User
