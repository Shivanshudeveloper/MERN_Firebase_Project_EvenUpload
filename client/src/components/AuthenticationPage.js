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
                <h1 style={{marginTop: '10px'}} className="ui huge header center aligned grid">
                    Even<span className="ui blue header">Upload <i className="fas fa-cloud"></i></span>
                </h1>

                <center style={{marginTop: '5%', width: 'auto'}}>
                    <div  className="ui compact segment">
                        <form className="ui form">
                            <div className="field">
                                <label style={{float: 'left'}} className="ui">Email</label>
                                <div className="ui left icon input">
                                    <input type="text" placeholder="example@examole.com" />
                                    <i className="user icon"></i>
                                </div>
                            </div>
                            <div className="field">
                                <label style={{float: 'left'}} className="ui left floated">Password</label>
                                <div className="ui left icon input">
                                    <input type="password" />
                                    <i className="lock icon"></i>
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui checkbox">
                                <input type="checkbox" />
                                <label>I agree to the Terms and Conditions</label>
                                </div>
                            </div>
                            <button className="fluid ui button primary" type="submit">Submit</button>
                        </form>

                        <div className="ui horizontal divider">Or</div>

                        <center>
                            <button onClick={() => signIn()} type="button" style={{marginTop: '1%'}} className="fluid ui google plus button">
                                <i style={{marginRight: '4px'}} className="fab mr-2 fa-google fluid"></i>
                                {signInBtn}
                            </button>
                        </center>
                    </div>
                </center>
                

                {/* <div className="ui two column centered grid">
                    <img className="eight wide column" src={cloud_temp_image_frontpage} />
                </div> */}

                
                
            </div>
        </Fragment>
    )
}

export default AuthenticationPage