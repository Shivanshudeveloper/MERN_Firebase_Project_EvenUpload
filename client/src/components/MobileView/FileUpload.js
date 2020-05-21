import React, { useState, useEffect, Fragment } from 'react';
import { v4 as uuid4 } from 'uuid';
import { Link } from 'react-router-dom';

// Firebase
import { auth, database, storage } from '../../Firebase/index';


// Component
import Progress from "../ProgressBar";
import Messages from "../Messages";
import File from "../File";
import Menu from './Menu';

// Utils
import no_files from '../../utils/no_files.png';

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
            // Checking for the File Size Greater than 1GB
            if (file.size >= 500288000) {
                setMessage('File is too large to Share');
                setTimeout(() => setMessage(''), 2000);
            } 
            // File Size Must be smaller than 1GB
            else {
                // const uploadTask = storage.ref(`uploads/${uniqueKey}_${file.name}`).put(file);
                const uploadTask = storage.ref(`uploads/${uniqueKey}/${file.name}`).put(file);


                uploadTask.on('state_changed', (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setUploadPercentage(progress);
                },
                (error) => {
                    setMessage(error);
                },
                () => {
                    // When the Storage gets Completed
                    storage.ref('uploads').child(`${uniqueKey}/${file.name}`).getDownloadURL().then(filePath => {
                        const fileName = `${file.name}`;

                        const fileKey = `${uniqueKey}/${file.name}`;

                        var date = new Date();
                        var dd = String(date.getDate()).padStart(2, '0');
                        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
                        var yyyy = date.getFullYear();
                        date = dd + '/' + mm + '/' + yyyy;


                        // Saved in Database about the User
                        const uploadData = {
                            date,
                            fileName,
                            filePath,
                            fileKey,
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
            }
            
        } else {
            e.preventDefault();
            console.log('No File');
            setMessage('No File Selected Yet');
            setTimeout(() => setMessage(''), 2000);
        }
        
    }

    


    return (
        <Fragment>
            <Menu />
            <div className="ui hidden divider"></div>
            <form onSubmit={onSubmit}>
                <div className="ui text container">
                    <label htmlFor="file" className="ui fluid toggle icon button">
                        {filename}
                    </label>
                    <input type="file" style={{display:'none'}} id="file" onChange={onChange} />
                
                    
                    <div style={{ marginTop: '4px' }}  class="ui buttons">
                        <Link className="ui secondary button" to="/qrcodedownload" >
                            <i className="folder white qrcode icon"></i>
                            Accept Files
                        </Link>
                        <Link className="ui violet button" to="/savefiles" >
                            <i className="save icon"></i>
                            Save Files
                        </Link>
                    </div>
                </div>


                
                {
                    filename !== 'Choose File' ? (
                        <>
                            <Progress percentage={uploadPercentage} />
                            <center>
                                <button type="submit" className={loading === 0 ? 'ui primary fluid medium button' : 'ui loading fluid primary medium button' }>
                                    <i className="cloud upload icon"></i>
                                    {btnUpload}
                                </button>
                            </center>
                        </>
                    ) : null
                }

                
            
            </form>

            <div className="ui hidden divider"></div>

            { message ? <Messages msg={message} /> : null }
            
            
            <div style={{marginTop: '1%'}} className="ui left aligned container">
            {
                loadingdata === 0 ? (
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
                ) : (
                    <div role="list" className="ui divided relaxed list">
                        { allData ? (
                            (Object.keys(allData).reverse()).map((data) => (
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
            <div className="ui hidden divider"></div>
            <div className="ui hidden divider"></div>

        </Fragment>
    )
}

export default FileUpload
