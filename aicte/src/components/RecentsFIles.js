import React, { useState, useEffect, Fragment } from 'react';

// Firebase
import { auth, database } from '../Firebase/index';

// Component
import RecentFile from "./RecentFile";



const RecentsFIles = ({ userId }) => {

    const [allData, setAllData] = useState({});

    useEffect(() => {
        database.ref(`files/${userId}`).orderByValue().limitToLast(5).once('value', function(snapshot) {
            setAllData(snapshot.val());
        });
    }, []);


    return (
        <Fragment>
            <div className="ui five stackable cards">

                { allData ? (
                    (Object.keys(allData)).map((data) => (
                        <RecentFile key={data} data={`files/${userId}/${data}`} />
                    ))
                    ) : null 
                }
            </div>
        </Fragment>
    )
}

export default RecentsFIles
