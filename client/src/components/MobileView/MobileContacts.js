import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    BrowserView,
    MobileView
} from 'react-device-detect';

// Components
import Menu from '../Menu';
import MobileMenu from './Menu';
import User from '../User';

// API Service
import { API_SERVICE } from '../../config/URI';

// Utils
import Empty_Inbox_Temp_Image from  '../../utils/empty_inbox.png';
// React Notification Toast
import { useToasts } from 'react-toast-notifications';


const ContactList = ({ contact, saveFile }) => {
    var date = new Date(contact.date);
    date = date.toDateString();
    return (
        <div>
            <div style={{marginTop: '10px'}} className="ui raised link fluid card">
                <div className="content">
                    <div style={{float: 'right'}}>
                        {date}
                    </div>
                    <div className="header">{contact.fileName}</div>

                    <div className="meta">
                        <span style={{marginTop: '4px'}} className="category">
                            <a target="_blank" href={contact.url}>
                                Download File
                            </a>
                        </span>
                    </div>
                    <div className="description">
                        <p>
                            {contact.message}
                        </p>
                    </div>
                </div>
                <div className="extra content">
                    <div className="left floated author">
                        <button onClick={() => saveFile(contact.senders_email, contact.senders_photoURL, contact.fileName, contact.url)} className="ui violet circular save icon button" >
                            <i className="save icon"></i>
                        </button>
                    </div>
                    <div className="left floated author">
                        <Link to={`/share?name=${contact.fileName}&fileId=${contact.fileId}`} className="ui green circular button share square icon" >
                            <i className="share square icon"></i>
                        </Link>
                    </div>

                    <div className="right floated author">
                        <img className="ui avatar image" src={contact.senders_photoURL} />
                    </div>
                </div>
            </div>    
        </div>
    )
}

const Contacts = () => {

    const { addToast } = useToasts();

    let userId = sessionStorage.getItem("userId");
    let sendersEmail = sessionStorage.getItem("userEmail"); 
    const [loading, setLoading] = useState(true);
    
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/contacts/${sendersEmail}`)
        .then(response => {
            setContacts(response.data);
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        axios.put(`${API_SERVICE}/api/v1/readwrite/resetinbox/${sendersEmail}`)
        .then(response => {
            console.log(response.status);
        })
    }, [])

    const saveFile = (senders_email, senders_photo,  file, url) => {
        axios.post(`${API_SERVICE}/api/v1/readwrite/savefiles`, {
            fileOf_usereId: userId,
            senders_email,
            senders_photo,
            file,
            url
        })
        .then(response => {
            console.log(response.status);
        })
        .catch(err => console.log(err))
        addToast(`${file} Saved Successfully`, { appearance: 'success', autoDismiss: true })
    }
    
    
    const showContactList = () => {
        return contacts.map(currentContact => {
            return <ContactList contact={currentContact} key={currentContact._id} saveFile={saveFile} />
        })
    }
        
    
    return (
        <Fragment>

            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>

                <BrowserView>
                    <div className="ui hidden divider"></div>
                    <Menu />
                </BrowserView>
                <MobileView>
                    <MobileMenu />
                </MobileView> 
            </div>
            
            <div className="ui left text aligned container">
                <div className="ui hidden divider"></div>

                   
                
                <div className="ui hidden divider"></div>
                
                {
                    loading ? (
                    <>
                        <div className="ui fluid placeholder">
                            <div className="image header">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                        <div className="ui fluid placeholder">
                            <div className="image header">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                        <div className="ui fluid placeholder">
                            <div className="image header">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                        <div className="ui fluid placeholder">
                            <div className="image header">
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                    </>
                    ) : (
                        contacts && contacts.length ? (
                            <>
                                {showContactList()}
                            </>
                        ) : (
                            <>
                                <center>
                                    <img className="ui large image" src={Empty_Inbox_Temp_Image} />
                                </center>
                            </>
                        )

                    )
                }
                
                
            </div>
        </Fragment>
    )
}

export default Contacts
