import React, { useState, useEffect, Fragment } from 'react';
import { v4 as uuid4 } from 'uuid';
import { Link } from 'react-router-dom';
import {
    BrowserView,
    MobileView
  } from 'react-device-detect';

// Firebase
import { auth, database, storage } from '../Firebase/index';


// Component
import Progress from "./ProgressBar";
import Messages from "./Messages";
import File from "./File";
import Menu from './Menu';
import RecentsFiles from './RecentsFIles';

// Utils
import no_files from '../utils/no_files.png';

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

    // Loading for uploading the file
    const [loading, setLoading] = useState(0);
    // Loading for loading all the files from server
    const [loadingdata, setLoadingData] = useState(0);
    


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
            setLoadingData(1);
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
        if (file) {
            setbtnUpload('Uploading....');
            setLoading(1);
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

                    var date = new Date();
                    var dd = String(date.getDate()).padStart(2, '0');
                    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = date.getFullYear();
                    date = dd + '/' + mm + '/' + yyyy;

                    // Saved in Database about the User
                    const uploadData = {
                        date,
                        fileName,
                        filePath
                    }

                    
                    
                    database.ref(`files/${userId}`).push(uploadData, (error) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Done");
                        }
                    });

                    setMessage('Successfully Uploaded');

                    setbtnUpload('Upload');
                    setLoading(0);
                    setTimeout(() => setUploadPercentage(0), 2000);
                    setTimeout(() => setMessage(''), 2000);
                    setTimeout(() => setFilename('Choose File'), 2000);
                    setTimeout(() => setFile(''), 2000);
                });
            });
        } else {
            e.preventDefault();
            console.log('No File');
            setMessage('No File Selected Yet');
            setTimeout(() => setMessage(''), 2000);
        }
        
    }

    


    return (
        <Fragment>
            <div className="ui hidden divider"></div>
            <Menu />
            <div className="ui hidden divider"></div>

            <form onSubmit={onSubmit}>
                <div className="ui text container">
                    <label htmlFor="file" className="ui toggle icon button">
                        {filename}
                    </label>
                    <input type="file" style={{display:'none'}} id="file" onChange={onChange} />
                </div>
                {
                    filename !== 'Choose File' ? (
                        <>
                            <Progress percentage={uploadPercentage} />
                            <center>
                                <button type="submit" className={loading === 0 ? 'ui primary medium button' : 'ui loading primary medium button' }>
                                    <i className="cloud upload icon"></i>
                                    {btnUpload}
                                </button>
                            </center>
                        </>
                    ) : null
                }
            </form>
            
            
            <Link style={{float: 'right'}} className="ui secondary button" to="/qrcodedownload" >
                Accept Files by QR Code
            </Link>
            <div className="ui hidden divider"></div>
            <div className="ui hidden divider"></div>
            <div className="ui hidden divider"></div>
            <BrowserView>
                <RecentsFiles userId={userId}  />
            </BrowserView>
            <div class="ui divider"></div>
            { message ? <Messages msg={message} /> : null }
            <div style={{marginTop: '1%', marginBottom: '5%'}} className="ui left aligned container">
            {
                loadingdata === 0 ? (
                    <>
                        <div className="ui fluid placeholder">
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                        <div className="ui fluid placeholder">
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                            <div className="paragraph">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div role="list" className="ui divided relaxed list">
                        { allData ? (
                            (Object.keys(allData)).map((data) => (
                                <File key={data} data={`files/${userId}/${data}`} />
                            ))
                        ) : 
                        <center>
                            <img className="ui large image" src={no_files} />
                        </center>
                        }
                    </div>
                )
            }
                
            </div>
        </Fragment>
    )
}

export default FileUpload
