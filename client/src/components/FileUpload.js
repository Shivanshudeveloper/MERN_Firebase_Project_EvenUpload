import React, { useState, useEffect, Fragment } from 'react';
import { v4 as uuid4 } from 'uuid';

// Firebase
import { auth, database, storage } from '../Firebase/index';

// Component
import Progress from "./ProgressBar";
import Messages from "./Messages";
import File from "./File";

const FileUpload = () => {
    const uniqueKey = uuid4();

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [btnUpload, setbtnUpload] = useState('Upload');
    const [allData, setAllData] = useState({});
    const [user, setUser] = useState({});



    useEffect(() => {
        database.ref().once('value', function(snapshot) {
            setAllData(snapshot.val());
        });
          
        // database.ref().on("value", (snapshot) => {
        //     console.log(snapshot.val());
        //     setAllData(snapshot.val());
        // }, (err) => {
        //     console.log(err);
        // })
    });

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUser(user);
            } else {
                console.log("No");
            }
        });
    }, []);
    

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const onSubmit = async e => {
        setbtnUpload('Uploading....');
        e.preventDefault();
        const uploadTask = storage.ref(`uploads/${uniqueKey}_${file.name}`).put(file);

        

        uploadTask.on('state_changed', (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadPercentage(progress);
        },
        (error) => {
            console.log(error);
            setMessage(error);
        },
        () => {
            // When the Storage gets Completed
            storage.ref('uploads').child(`${uniqueKey}_${file.name}`).getDownloadURL().then(filePath => {
                console.log(filePath);
                const fileName = `${uniqueKey}_${file.name}`;

                // Saved in Database about the User
                const uploadData = {
                    user: 'Shivanshu',
                    fileName,
                    filePath
                }
                database.ref().push(uploadData, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Done");
                    }
                })

                setMessage('File Successfully Uploaded to Server');

                setbtnUpload('Upload');
                setTimeout(() => setUploadPercentage(0), 4000);
                setTimeout(() => setMessage(''), 2000);
                setTimeout(() => setFilename('Choose File'), 4000);
            });
        });
    }

    


    return (
        <Fragment>
            { message ? <Messages msg={message} /> : null }
            <form onSubmit={onSubmit}>
                <div className="custom-file mt-4 mb-4">
                    <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                    <label className="custom-file-label" htmlFor="customFile">
                        {filename}
                    </label>
                </div>
                <Progress percentage={uploadPercentage} />
                <input type="submit" value={btnUpload} className="btn btn-primary btn-block mt-4" />
            </form>
            
            <h3 className="mt-4">Files</h3>
            <div className="list-group mt-2">
                { allData ? (
                    (Object.keys(allData)).map((data) => (
                        <File key={data} data={data} />
                    ))
                ) : 
                <center>
                    <img className="w-75" src="https://cdn.dribbble.com/users/93860/screenshots/6619359/file.png" />
                </center>
                }
            </div>
        </Fragment>
    )
}

export default FileUpload
