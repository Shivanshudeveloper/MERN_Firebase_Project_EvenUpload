import React from 'react';

const Paggination = ({ nextLoad, previousLoad }) => {
    return (
        <div style={{float: 'right', marginBottom: '4%'}}>
            <button onClick={() => previousLoad() } className="ui left labeled icon button">
                <i className="left arrow icon"></i>
                Previous
            </button>
            <button onClick={() => window.location = "/home"} className="ui icon button">
                <i className="home blue icon"></i>
            </button>
            <button onClick={() => nextLoad() } className="ui right labeled icon button">
                <i className="right arrow icon"></i>
                Next
            </button>
        </div>
    )
}

export default Paggination;
