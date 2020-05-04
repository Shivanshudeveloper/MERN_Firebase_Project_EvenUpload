import React, { useState, useEffect, Fragment } from 'react'
import { auth } from '../Firebase/index';
import { Link } from 'react-router-dom';

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
        <div className="ui equal width grid">
            <div className="column">
                {
                    !user.photoURL ? (
                        <div className="ui tiny header">
                            {user.email}
                        </div>
                    ) : (
                        <>
                            <img src={user.photoURL} className="ui middle aligned mini image circular"  />
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




            


        </Fragment>
    )
}

export default User
