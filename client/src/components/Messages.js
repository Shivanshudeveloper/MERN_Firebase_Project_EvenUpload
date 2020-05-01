import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ msg }) => {
    return (
        <div className="alert alert-info mt-2 mb-2" role="alert">
            {/* Message of file beign uploaded */}
            {msg}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

Message.propTypes = {
    msg: PropTypes.string.isRequired
}

export default Message;