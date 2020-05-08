import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
// Firebase
import { auth, database } from '../Firebase/index';

// Utils
import no_files from '../utils/no_files.png';

// Components
import Menu from './Menu';
import Messages from "./Messages";
import AllPhotos from "./AllPhotos";
import User from './User';

const ContactList = ({ contact }) => {


    return (
        <>
            <div className="ui raised fluid link card">
                <div className="content">
                    <div className="header">{contact.fileName}</div>
                    <div className="meta">
                    <span className="category">
                        <a target="_blank" href={contact.url}>
                            Download File
                        </a>
                    </span>
                    </div>
                </div>
                <div className="extra content">
                    <div className="right floated author">
                    <img className="ui avatar image" src={contact.senders_photoURL} /> {contact.senders_email}
                    </div>
                </div>
            </div>
        </>
    )
}

const Contacts = () => {

    let userId = sessionStorage.getItem("userId");
    let sendersEmail = sessionStorage.getItem("userEmail"); 
    
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axios.get(`/api/v1/readwrite/contacts/${sendersEmail}`)
        .then(response => {
            setContacts(response.data);
        })
    }, [])
    
    
    const showContactList = () => {
        return contacts.map(currentContact => {
            return <ContactList contact={currentContact} key={currentContact._id} />
        })
    }
        
    
    return (
        <Fragment>
            <div className="ui left text aligned container">
                <User />
                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
                <Menu />    
                <div className="ui hidden divider"></div>
                
                {showContactList()}
                
                
            </div>
        </Fragment>
    )
}

export default Contacts
