import React, { useState ,useEffect, Fragment } from 'react';
import { googleProvider, facebookProvider, auth } from "../Firebase/index";
import { Link } from 'react-router-dom';

// Components
import Messages from './Messages';

// Utils
import tempImage from '../utils/temp_img_frontpage.gif';
import BackgroundImage from '../utils/background-website-01.jpg';

var sectionStyle = {
    backgroundImage: `url('${BackgroundImage}')`,
    backgroundSize:'cover',
    backgroundPosition:'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    background: 'cover',
    width: '100%'
};
  
var headeingFont = {
    marginTop: '12px', 
    fontFamily: 'Roboto',
}

const AuthenticationPage = () => {

    const [signInBtn, setSignInBtn] = useState('Sign In Google');
    const [signInBtnFacebook, setSignInBtnFacebook] = useState('Sign In Facebook');
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

    const signInFacebook = () => {
        auth.signInWithPopup(facebookProvider).then(function(result) {
            setSignInBtnFacebook('Signing In....');
            console.log(result);
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
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
                    sessionStorage.setItem("userEmail", user.email);
                    if (user.emailVerified) {
                        window.location.href = "/home";
                    }
                } else {
                    setMessage('We have send a Verification Link on your Email Address');
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
                sessionStorage.setItem("userEmail", user.email);
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
            <section style={ sectionStyle }>
            <div className="ui hidden divider"></div>
                <center>
                    <h1 className={headeingFont}>
                        <span className="ui small header"> Even <i className="cloud blue icon"></i> Upload</span>
                    </h1>
                </center>
                <div className="ui container">
                    <center style={{marginTop: '1%', width: 'auto'}}>
                        { message ? <Messages msg={message} /> : null }
                        <div  className="ui compact segment">
                            <Link className="fluid ui secondary button" to="/qrcodedownload" >
                                <i className="qrcode icon"></i>
                                Accept Files by QR Code
                            </Link>
                            <form style={{marginTop: '10px'}} className="ui form">
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
                                    <i style={{marginRight: '4px'}} className="google icon"></i>
                                    {signInBtn}
                                </button>
                                <button onClick={() => signInFacebook()} style={{ marginTop: '1%' }} className="ui fluid facebook button">
                                    <i className="facebook icon"></i>
                                    {signInBtnFacebook}
                                </button>
                            </center>
                            <img className="ui medium image" src={tempImage} />
                        </div>
                    </center>
                </div>
            </section>
        </Fragment>
    )
}
export default AuthenticationPage
