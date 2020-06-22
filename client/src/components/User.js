import React, { useState, useEffect, Fragment } from 'react'
import { auth } from '../Firebase/index';

// For Desktop and Mobile Views
import {
    BrowserView,
    MobileView
} from 'react-device-detect';

const User = () => {
       

    const [user, setUser] = useState({});
    const [username, setName] = useState('');
    const [greeting, setGreeting] = useState('Hi, ');

    useEffect(() => {
        var d = new Date();
        var time = d.getHours();
        if (time < 12) {
            setGreeting('Good Morning ');
        } else if (time >= 12) {
            setGreeting('Good Afternoon ');
        } else {
            setGreeting('Good Evening ');
        }

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
                            !user.displayName ? (
                                <>
                                        <img src={user.photoURL} class="ui avatar image" />
                                        <span style={{marginLeft: '6px'}}>
                                            <strong> {user.email} </strong>
                                        </span>
                                        
                                </>
                            ) : (
                                <>
                                        <img src={user.photoURL} class="ui avatar image" />
                                        <span style={{marginLeft: '6px'}}>
                                            <strong> {user.displayName} </strong>
                                        </span>
                                        
                                </>
                            )
                            
                        )
                    }
                </div>
                <div className="column">
                    <button onClick={() => signOut()} className="ui circular google icon button">
                        <i className="blue cog icon"></i>
                    </button> 
                </div>
            </div>
        </BrowserView>

        <MobileView>
            <div>
                <div style={{float: 'left'}}>
                    <button onClick={() => signOut()} className="ui circular google icon button">
                        <i className="blue cog icon"></i>
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
