import React, { useEffect, Fragment } from 'react';
import { googleProvider, auth } from "../Firebase/index";
import { Redirect } from "react-router-dom";

const AuthenticationPage = () => {

    const signIn = () => {
        auth.signInWithPopup(googleProvider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log(errorMessage, email, credential);
          });
          
    }

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                console.log("User");
                window.location.href = "/home";
            } else {
                console.log("No");
            }
        });
    }, []);

    return (
        <Fragment>
            <div className="container">
                <h2 className="h2 display-4 text-center mt-4 font-weight-bold">
                Even<span className="text-primary" >Upload</span> <i className="fas fa-star text-warning"></i>
                </h2>

                <button onClick={() => signIn()} type="button" style={{marginTop: '40%'}} className="btn btn-block btn-primary">
                    <i className="fab mr-2 fa-google"></i>
                    Sign In Google
                </button>
            </div>
        </Fragment>
    )
}

export default AuthenticationPage