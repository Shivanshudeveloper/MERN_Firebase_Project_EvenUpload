import React, { useState, useEffect, Fragment } from 'react';
import { v4 as uuid4 } from 'uuid';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';

// Firebase
import { auth, database, storage } from '../../Firebase/index';


// Component
import Progress from "../ProgressBar";
import Messages from "../Messages";
import File from "../File";
import Menu from './Menu';
import Paggination from '../Paggination';

// Utils
import no_files from '../../utils/no_files.png';

// React Notification Toast
import { useToasts } from 'react-toast-notifications';


const FileName = ({ f }) => {
    return (
        <>
        <div className="ui left aligned segment">
            <div style={{marginRight: '4px'}} className="ui active small inline loader"></div> {f.name}
        </div>
        </>
    )
}

const FileUpload = () => {
    // For Nitifying 
    const { addToast } = useToasts();
    
    
    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 

    const [file, setFile] = useState([]);
    const [filename, setFilename] = useState('Choose File');
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [btnUpload, setbtnUpload] = useState('Start the Upload');
    const [allData, setAllData] = useState({});
    const [user, setUser] = useState({});
    const [folderName, setFolderName] = useState('');

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
        if (file.length > 0) {
            onSubmit();
        } else {
            console.log("N");
        }
    }, [file])

    useEffect(() => {
        database.ref(`files/${userId}`).limitToLast(20).once('value', function(snapshot) {
            setAllData(snapshot.val());
            setLoadingData(1);
            // database.ref(`files/${userId}`).startAt(null, '-MAAtTfLCzuOesDGp8Qu').once('value', function(snapshot) {
            //     setAllData(snapshot.val());
            //     setLoadingData(1);
            // });
        });
        // database.ref().on("value", (snapshot) => {
        //     console.log(snapshot.val());
        //     setAllData(snapshot.val());
        // }, (err) => {
        //     console.log(err);
        // })
    }, []);
    

    // const onChange = e => {
    //     // setFile(e.target.files[0]);
    //     // setFilename(e.target.files[0].name);

    //     setFilename("DS");

    //     for (let i = 0; i < e.target.files.length; i++) {
    //         const newFile = e.target.files[i];
    //         console.log(newFile);
    //         newFile["id"] = Math.random();
    //         setFile(prevState => [...prevState, newFile]);
    //     }

        
    // }

    // Refreshing the list of the user all files after uploading 
    const refreshData = () => {
        database.ref(`files/${userId}`).limitToLast(20).once('value', function(snapshot) {
            setAllData(snapshot.val());
            setLoadingData(1);
        });
    }

    const onSubmit = () => {
        // e.preventDefault();

        if (file.length > 0) {
            setbtnUpload('Uploading....');
            setLoading(1);
            file.forEach(file => {
                var uniquetwoKey = uuid4();

                const uploadTask = storage.ref(`uploads/${uniquetwoKey}/${file.name}`).put(file);
                

                uploadTask.on('state_changed', (snapshot) => {
                    // const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    const progress =  Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    
                    setUploadPercentage(progress);
                    // if (snapshot.state === storage.TaskState.RUNNING) {
                    //     setUploadPercentage(progress);
                    // }
                    
                },
                (error) => {
                    setMessage(error);
                },
                async () => {
                    // When the Storage gets Completed
                    const filePath = await uploadTask.snapshot.ref.getDownloadURL();
                    const fileKey = `${uniquetwoKey}/${file.name}`;
                    const fileName = `${file.name}`;
                    // Generate the Date
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

                    addToast(`${fileName} File Successfully Uploaded`, { appearance: 'success', autoDismiss: true })
                    setbtnUpload('Start the Upload');
                    setLoading(0);
                    setTimeout(() => setUploadPercentage('Ready to Upload'), 2000);
                    setTimeout(() => setFilename('Choose File'), 2000);
                    setTimeout(() => setFile([]), 1000);
                    // Refreshing the list of all files of user after uploading
                    refreshData();
                });
            })
            

        } else {
            setMessage('No File Selected Yet');
            setTimeout(() => setMessage(''), 2000);
        }
        
        // if (file) {
        //     e.preventDefault();
        //     // Checking for the File Size Greater than 1GB
        //     if (file.size >= 500288000) {
        //         addToast(`File size is too large to upload`, { appearance: 'error', autoDismiss: true })
        //     } 
        //     // File Size Must be smaller than 1GB
        //     else {
        //         setbtnUpload('Uploading....');
        //         setLoading(1);
        //         // const uploadTask = storage.ref(`uploads/${uniqueKey}_${file.name}`).put(file);
        //         const uploadTask = storage.ref(`uploads/${uniqueKey}/${file.name}`).put(file);

        //         uploadTask.on('state_changed', (snapshot) => {
        //             const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //             setUploadPercentage(progress);
        //         },
        //         (error) => {
        //             setMessage(error);
        //         },
        //         () => {
        //             // When the Storage gets Completed
        //             storage.ref('uploads').child(`${uniqueKey}/${file.name}`).getDownloadURL().then(filePath => {
        //                 const fileName = `${file.name}`;

        //                 const fileKey = `${uniqueKey}/${file.name}`;

        //                 var date = new Date();
        //                 var dd = String(date.getDate()).padStart(2, '0');
        //                 var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        //                 var yyyy = date.getFullYear();
        //                 date = dd + '/' + mm + '/' + yyyy;


        //                 // Saved in Database about the User
        //                 const uploadData = {
        //                     date,
        //                     fileName,
        //                     filePath,
        //                     fileKey,
        //                 }

                        
                        
        //                 database.ref(`files/${userId}`).push(uploadData, (error) => {
        //                     if (error) {
        //                         console.log(error);
        //                     } else {
        //                         console.log("Done");
        //                     }
        //                 });

        //                 addToast(`${fileName} File Successfully Uploaded`, { appearance: 'success', autoDismiss: true })
        //                 setbtnUpload('Start the Upload');
        //                 setLoading(0);
        //                 setTimeout(() => setUploadPercentage('Ready to Upload'), 2000);
        //                 setTimeout(() => setFilename('Choose File'), 2000);
        //                 setTimeout(() => setFile(''), 2000);
        //                 // Refreshing the list of all files of user after uploading
        //                 refreshData();
        //             });
        //         });
        //     }
            
        // } else {
        //     e.preventDefault();
        //     setMessage('No File Selected Yet');
        //     setTimeout(() => setMessage(''), 2000);
        // }
   }

    const cancelFileUpload = () => {
        setFilename('Choose File');
        setFile([]);
        setbtnUpload('Start the Upload');
        setLoading(0);
        setUploadPercentage('Ready to Upload');
    }

    // For Paginate the Pages
    const nextLoad = () => {
        var keys = Object.keys(allData);
        // var lastKeyOfData = keys[keys.length - 1];
        var lastKeyOfData = keys[0];
        setLoadingData(0);
        database.ref(`files/${userId}`).endAt(null, `${lastKeyOfData}`).limitToLast(20).once('value', function(snapshot) {
            setAllData(snapshot.val());
            setLoadingData(1);
        });
    }

    const previousLoad = () => {
        var keys = Object.keys(allData);
        var lastKeyOfData = keys[keys.length - 1];
        // var lastKeyOfData = keys[0];
        setLoadingData(0);
        database.ref(`files/${userId}`).startAt(null, `${lastKeyOfData}`).limitToFirst(20).once('value', function(snapshot) {
            setAllData(snapshot.val());
            setLoadingData(1);
        });
    }

    const createNewFolder = () => {
        if (folderName === '') {
            addToast(`Folder name is missing`, { appearance: 'error', autoDismiss: true });
        } else {
            var uniquetwoKey = uuid4() + '_FOLDER_' + Date.now();
            var date = new Date();
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            date = dd + '/' + mm + '/' + yyyy;

            // Saved in Database about the User
            const uploadData = {
                date,
                fileName: folderName,
                filePath: 'FOLDER',
                fileKey: uniquetwoKey
            }

            database.ref(`files/${userId}`).push(uploadData, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Done");
                }
            });

            addToast(`Folder ${folderName} created`, { appearance: 'success', autoDismiss: true });
            setFolderName('');
            refreshData();
        }
    }

    const handleDrop = async (acceptedFiles) => {
        setFile(acceptedFiles.map(file => file));
        setFilename("Files");
    }
    
    
    const uploadfileName = () => {
        return file.map(f => {
            return <FileName f={f} key={f} />
        })
    }
    

    
    return (
        <Fragment>
            <Menu />
            <div className="ui hidden divider"></div>
            <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <div className="ui button">Drop your files, or click to select files</div>
                    </div>
                )}
            </Dropzone>

            {/* Create Folder Model */}
            <div id="createFolderModel" className="ui modal">
                        <i className="close icon"></i>
                        <div className="header">
                            Create Folder
                        </div>
                        <div className="image content">
                            <div className="description">
                                <form className="ui form">
                                    <div className="field">
                                        <label>Folder Name</label>
                                        <input required type="text" value={folderName} onChange={(event) => setFolderName(event.target.value)} name="first-name" placeholder="New Folder" />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="actions">
                            <div onClick={() => createNewFolder()} className="ui positive right labeled icon button">
                                Create
                                <i className="checkmark icon"></i>
                            </div>
                        </div>
                    </div>
            {/* Create Folder Model */}
            <div style={{ marginTop: '4px' }} className="ui container text">
                <button id="createFolderBtn" className="ui icon button violet fluid">
                    <i className="folder icon"></i>
                    New Folder
                </button>
            </div>
            
            <form onSubmit={onSubmit}>
                <div className="ui text container">
                    {/* <label htmlFor="file" className="ui fluid toggle icon button">
                        {filename}
                    </label>
                    <input type="file" style={{display:'none'}} id="file" onChange={onChange} /> */}
                
                    
                    
                </div>

                

            


                


                
                {
                    filename !== 'Choose File' ? (
                        <>
                            {/* <Progress percentage={uploadPercentage} /> */}
                            <h4 className="ui header" style={{textAlign: 'left'}} >Uploading <span className="ui green header "> {uploadPercentage} % </span> </h4>
                            <div className="ui raised segments">
                                <div className="ui right aligned segment">
                                    <button type="button" onClick={() => cancelFileUpload()} className={'ui red medium button'}>
                                        X
                                    </button>
                                </div>
                                { uploadfileName() }
                            </div>
                            <center>
                                {/* <button type="submit" className={loading === 0 ? 'ui green medium button' : 'ui loading green medium button' }>
                                    <i className="cloud upload icon"></i>
                                    {btnUpload}
                                </button> */}
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
                    <>
                        <div role="list" className="ui raised segments">
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
                        <Paggination nextLoad={nextLoad} previousLoad={previousLoad} />
                    </>
                )
            }
                
            </div>
            <div className="ui hidden divider"></div>
            <div className="ui hidden divider"></div>

        </Fragment>
    )
}

export default FileUpload
