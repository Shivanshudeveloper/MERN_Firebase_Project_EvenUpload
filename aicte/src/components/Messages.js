import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ msg }) => {
    return (
        <div className="ui text success message">
            <div className="content">
                <div className="header">{msg}</div>
            </div>
        </div>
    )
}

Message.propTypes = {
    msg: PropTypes.string.isRequired
}

export default Message;