import React from 'react'
import PropTypes from 'prop-types'

const Progress = ({ percentage }) => {
    return (
        <>
            <div className="ui progress success">
                <div className="bar" style={{width: `${percentage}%`}}>
                </div>
                <div className="label">
                    {percentage}%
                </div>
            </div>
        </>
    )
}

Progress.propTypes = {
    percentage: PropTypes.number.isRequired
}

export default Progress