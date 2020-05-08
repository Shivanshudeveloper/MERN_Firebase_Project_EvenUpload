import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
// Firebase
import { auth, database } from '../Firebase/index';

// Components
import Menu from './Menu';
import User from './User';
import ContactListUser from './ContactList';


const Contacts = () => {

    let userId = sessionStorage.getItem("userId");
    let sendersEmail = sessionStorage.getItem("userEmail"); 
    
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axios.get(`https://evencloud.herokuapp.com/api/v1/readwrite/contacts/${sendersEmail}`)
        .then(response => {
            setContacts(response.data);
        })
    }, [])
    
    
    const showContactList = () => {
        return contacts.map(currentContact => {
            return <ContactListUser contact={currentContact} key={currentContact._id} />
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
