import React from 'react'

const ContactList = ({ contact }) => {
    return (
        <div>
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
        </div>
    )
}

export default ContactList
