import React, { useState ,useEffect, Fragment } from 'react';
import { googleProvider, auth } from "../Firebase/index";
import { Link } from 'react-router-dom';

// Components
import Messages from './Messages';

const AuthenticationPage = () => {

    const [signInBtn, setSignInBtn] = useState('Sign In Google');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


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
            setMessage(errorMessage);
          });
    }

    const login = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            auth.onAuthStateChanged(function(user) {
                if (user) {
                    sessionStorage.setItem("userId", user.uid);
                    console.log(user.emailVerified);
                    if (user.emailVerified) {
                        window.location.href = "/home";
                    }
                } else {
                    console.log("No");
                }
            });
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            setMessage(errorMessage);
        });
    }

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                sessionStorage.setItem("userId", user.uid);
                console.log(user.emailVerified);
                if (!user.emailVerified) {
                    user.sendEmailVerification().then(function() {
                        setMessage('We have send a Verification Link on your Email Address');
                    }).catch(function(error) {
                        console.log(error);
                    });
                } else {
                    window.location.href = "/home";
                }
            } else {
                console.log("No");
            }
        });
    }, []);

    return (
        <Fragment>
                

            <h1 style={{marginTop: '10px'}} className="ui huge header center aligned grid">
                Even<span className="ui blue header">Upload <i className="fas fa-cloud"></i></span>
            </h1>
            <div style={{marginTop: '40px'}} className="ui text center aligned container">
                { message ? <Messages msg={message} /> : null }
            </div>
            <div className="ui container">
                <center style={{marginTop: '5%', width: 'auto'}}>
                    <div  className="ui compact segment">
                        <form className="ui form">
                            <div className="field">
                                <label style={{float: 'left'}} className="ui">Email</label>
                                <div className="ui left icon input">
                                    <input 
                                    type="email" 
                                    placeholder="example@examole.com" 
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    />
                                    <i className="user icon"></i>
                                </div>
                            </div>
                            <div className="field">
                                <label style={{float: 'left'}} className="ui left floated">Password</label>
                                <div className="ui left icon input">
                                    <input 
                                    type="password" 
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    />
                                    <i className="lock icon"></i>
                                </div>
                            </div>
                            
                            <button onClick={(event) => login(event)} className="fluid ui button primary" type="submit">Login</button>
                        </form>
                        
                        <Link to='/register'>Don't have an Account</Link>

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