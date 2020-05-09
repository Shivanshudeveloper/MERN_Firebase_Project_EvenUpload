import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

import {
    BrowserView,
    MobileView
} from 'react-device-detect';

// Components
import Menu from './Menu';
import MobileMenu from './MobileView/Menu';
import User from './User';

// API Service
import { API_SERVICE } from '../config/URI';

// Utils
import Empty_Inbox_Temp_Image from  '../utils/empty_inbox.png';


const ContactList = ({ contact }) => {
    var date = new Date(contact.date);
    date = date.toDateString();
    return (
        <div>
            <div style={{marginTop: '10px'}} className="ui raised fluid link card">
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
                    <div className="right floated author">
                    <img className="ui avatar image" src={contact.senders_photoURL} /> {contact.senders_email}
                    </div>
                </div>
            </div>    
        </div>
    )
}

const Contacts = () => {

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
    
    
    const showContactList = () => {
        return contacts.map(currentContact => {
            return <ContactList contact={currentContact} key={currentContact._id} />
        })
    }
        
    
    return (
        <Fragment>
            <div className="ui center aligned container">
                <User />
            </div>
            
            <div className="ui left text aligned container">
                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>

                <BrowserView>
                    <Menu />
                </BrowserView>
                <MobileView>
                    <MobileMenu />
                </MobileView>    
                
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
