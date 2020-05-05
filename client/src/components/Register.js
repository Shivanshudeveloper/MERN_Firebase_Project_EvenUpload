import React, { useState, Fragment } from 'react';
import { auth } from "../Firebase/index";
import { Link } from 'react-router-dom';

// Components
import Messages from './Messages';

// Utils
import tempImageRegister from '../utils/temp_register.gif';
import BackgroundImage from '../utils/background-website-01.jpg';

var sectionStyle = {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize:'contain',
    backgroundPosition:'top',
    background: 'cover',
    width: '100%'
};

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const register = (event) => {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email, password).then(() => {
            window.location.href = '/';
        })
        .catch(function(error) {
            var errorMessage = error.message;
            setMessage(errorMessage);
        });
    }

    return (
        <Fragment>
            <section style={ sectionStyle }>
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
                                <div className="field">
                                    <div className="ui checkbox">
                                    <input type="checkbox" />
                                    <label>I agree to the Terms and Conditions</label>
                                    </div>
                                </div>
                                <button onClick={(event) => register(event)} className="fluid ui button primary" type="submit">Register</button>
                            </form>
                            <Link to='/'>Already have an account</Link>
                            <img className="ui medium image" src={tempImageRegister} />
                        </div>
                    </center>
                </div>
            </section>
        </Fragment>
    )
}

export default Register