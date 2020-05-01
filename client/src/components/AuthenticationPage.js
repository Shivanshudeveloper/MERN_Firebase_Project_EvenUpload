import React, { useState ,useEffect, Fragment } from 'react';
import { googleProvider, auth } from "../Firebase/index";

// Utils Images
// @Cloud Temporary Image for Front Page Authentication
import cloud_temp_image_frontpage from "../utils/cloud_temp_img_frontpage.gif";

const AuthenticationPage = () => {

    const [signInBtn, setSignInBtn] = useState('Sign In Google');

    const signIn = () => {
        auth.signInWithPopup(googleProvider).then(function(result) {
            setSignInBtn('Signing In....');
          }).catch(function(error) {
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
                sessionStorage.setItem("userId", user.uid);
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
                <h1 className="text-center mt-4 font-weight-bold">
                Even<span className="text-primary" >Upload</span> <i className="fas fa-cloud text-primary"></i>
                </h1>

                <center>
                    <img className="w-50" src={cloud_temp_image_frontpage} />
                </center>

                <center>
                    <button onClick={() => signIn()} type="button" style={{marginTop: '4%'}} className="btn w-auto btn-primary">
                        <i className="fab mr-2 fa-google"></i>
                        {signInBtn}
                    </button>
                </center>
                
            </div>
        </Fragment>
    )
}

export default AuthenticationPage