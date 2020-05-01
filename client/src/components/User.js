import React, { useState, useEffect, Fragment } from 'react'
import { auth } from '../Firebase/index';
import { Link } from 'react-router-dom';

const User = () => {
    let avartar = {
        width: '50px',
        height: '50px',
        borderRadius: '50%'
    }

    

    const [user, setUser] = useState({});

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUser(user);
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
            <img src={user.photoURL} style={avartar} className="img-fluid float-left mt-2"  />

            <button onClick={() => signOut()} className="float-right mt-2 btn btn-outline-danger btn-sm">
                Logout
            </button> 

            <center>
                <Link to="/home">
                    <span style={{'fontSize': '36px'}}>
                        <i className="fas text-primary mb-4 fa-home"></i>
                    </span>
                </Link>
            </center>

        </Fragment>
    )
}

export default User
