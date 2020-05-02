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
    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [btnUpload, setbtnUpload] = useState('Upload');
    const [allData, setAllData] = useState({});
    const [user, setUser] = useState({});


    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUser(user);
            } else {
                console.log("No");
            }
        });
    }, []);

    useEffect(() => {
        database.ref(`files/${userId}`).once('value', function(snapshot) {
            setAllData(snapshot.val());
        });
        // database.ref().on("value", (snapshot) => {
        //     console.log(snapshot.val());
        //     setAllData(snapshot.val());
        // }, (err) => {
        //     console.log(err);
        // })
    });
    

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const onSubmit = async e => {
        if (filename !== '') {
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
                    
                    database.ref(`files/${userId}`).push(uploadData, (error) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Done");
                        }
                    })

                    setMessage('Successfully Uploaded');

                    setbtnUpload('Upload');
                    setTimeout(() => setUploadPercentage(0), 2000);
                    setTimeout(() => setMessage(''), 2000);
                    setTimeout(() => setFilename('Choose File'), 2000);
                    setTimeout(() => setFile(''), 2000);
                });
            });
        } else {
            console.log(filename);
            setMessage('No File Selected Yet');
            setTimeout(() => setMessage(''), 2000);
        }
        
    }

    


    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                <div className="custom-file mt-4 mb-4">
                    <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                    <label className="custom-file-label" htmlFor="customFile">
                        {filename}
                    </label>
                </div>
                <Progress percentage={uploadPercentage} />
                <center>
                    <input type="submit" value={btnUpload} className="btn btn-primary w-auto mt-4" />
                </center>
            </form>

            { message ? <Messages msg={message} /> : null }
            
            <h3 className="mt-4">
                <i className="fas fa-folder text-warning mr-2"></i>
                <strong>
                    Files
                </strong>
            </h3>
            <ul className="list-group mt-2">
                { allData ? (
                    (Object.keys(allData)).map((data) => (
                        <File key={data} data={`files/${userId}/${data}`} />
                    ))
                ) : 
                <center>
                    <img className="w-75" src="https://cdn.dribbble.com/users/93860/screenshots/6619359/file.png" />
                </center>
                }
            </ul>
            
            
        </Fragment>
    )
}

export default FileUpload
