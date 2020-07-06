import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import Dropzone from 'react-dropzone';
import {
    BrowserView,
    MobileView
} from 'react-device-detect';
import { v4 as uuid4 } from 'uuid';

// Components
import Menu from './Menu';
import MobileMenu from './MobileView/Menu';
import User from './User';

// Firebase
import { auth, storage } from '../Firebase/index';

// API Service
import { API_SERVICE, SECRET_KEY } from '../config/URI';

// React Notification Toast
import { useToasts } from 'react-toast-notifications';

const FileName = ({ f }) => {
    return (
        <>
        <div className="ui left aligned segment">
            <div style={{marginRight: '4px'}} className="ui active small inline loader"></div>  {f.name}
        </div>
        </>
    )
}

const FolderFileList = ({ file }) => {
    return (
        <>
            <div className="ui left aligned attached segment">
                <i className="file alternate icon purple big"></i>
                <a target="_blank" href={file.filePath}>
                     { file.fileName } 
                </a>
            </div>
        </>
    )
}

const Folder = ({ location }) => {
    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 
    let userEmail = sessionStorage.getItem("userEmail");

    const [folderName, setFolderName] = useState('');
    const [folderKey, setFolderKey] = useState('');
    const [file, setFile] = useState([]);
    const [filename, setFilename] = useState('Choose File');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [folderFiles, setFolderFiles] = useState([]);
    const [loadingfiles, setLoadingFiles] = useState(true);
    const [userphotoURL, setUserPhotoURL] = useState('');

    let [shareToEmail, setShareToEmail] = useState('');
    const [shareDescription, setshareDescription] = useState('');

    const { addToast } = useToasts();

    useEffect(() => {
        // Getting the pid and project name from url
        const { n, s } = queryString.parse(location.search);
        setFolderName(n);
        setFolderKey(s);

        axios.get(`${API_SERVICE}/api/v1/readwrite/folderfiles/${n}/${s}`)
        .then(response => {
            setFolderFiles(response.data);
            setLoadingFiles(false);
        })

        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUserPhotoURL(user.photoURL);
            } else {
                console.log("No");
                window.location.href = "/";
            }
        });
    }, [])

    useEffect(() => {
        if (file.length > 0) {
            onSubmit();
        } else {
            console.log("N");
        }
    }, [file])

    const refreshData = () => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/folderfiles/${folderName}/${folderKey}`)
        .then(response => {
            setFolderFiles(response.data);
        })
    }

    const onSubmit = () => {
        // e.preventDefault();

        if (file.length > 0) {
            file.forEach(file => {
                var uniquetwoKey = uuid4() + '_FOLDERFILES_' + Date.now();

                const uploadTask = storage.ref(`uploads/folders/${uniquetwoKey}/${file.name}`).put(file);
                

                uploadTask.on('state_changed', (snapshot) => {
                    // const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    const progress =  Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    
                    setUploadPercentage(progress);
                    // if (snapshot.state === storage.TaskState.RUNNING) {
                    //     setUploadPercentage(progress);
                    // }
                    
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    // When the Storage gets Completed
                    const filePath = await uploadTask.snapshot.ref.getDownloadURL();
                    const fileName = `${file.name}`;

                    // Saved in Database about the User
                    const uploadData = {
                        folderName,
                        userId,
                        userEmail,
                        fileName,
                        filePath,
                        folderKey
                    }

                    axios.post(`${API_SERVICE}/api/v1/readwrite/uploadfolderfiles`, uploadData)
                            .then((res) => {
                                if (res.status === 200) {
                                    console.log(res.status);
                                    addToast(`${fileName} File Successfully Uploaded`, { appearance: 'success', autoDismiss: true })
                                    setFile([]);
                                    setFilename('Choose File');
                                    refreshData();
                                }
                            })
                            .catch(err => console.log(err))
                });
            })
            

        } else {
            addToast(`No File Selected`, { appearance: 'error', autoDismiss: true })
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

    const cancelFileUpload = () => {
        setFilename('Choose File');
        setFile([]);
        setUploadPercentage(0);
    }

    const showFolderFileList = () => {
        return folderFiles.map(file => {
            return <FolderFileList file={file} key={file._id} />
        })
    }

    // Sharing Project
    const share = () => {
        // Sharing Email Address
        shareToEmail = shareToEmail.split(' ').join('');
        // Saved in Database about the User
        const uploadData = {
            fileName: folderName,
            to: shareToEmail,
            from: userId,
            url: 'FOLDER',
            senders_photoURL: userphotoURL,
            senders_email: userEmail,
            message: shareDescription,
            fileKey: 'NIL',
            fileId: folderKey
        }

        axios.post(`${API_SERVICE}/api/v1/readwrite`, uploadData)
            .then((res) => {
                if (res.status === 200) {
                    addToast(`Folder Successfully Shared`, { appearance: 'success', autoDismiss: true });
                }
            })
            .catch(err => console.log(err))

        axios.put(`${API_SERVICE}/api/v1/readwrite/inbox/${userId}/${shareToEmail}`)
            .then(res => console.log(res.status))
            .catch(err => console.log(err))
    } 

    return (
        <Fragment>
            <div className="ui center aligned container">
                <User />
                <div className="ui hidden divider"></div>

                <BrowserView>
                    <div className="ui hidden divider"></div>
                    <Menu />
                </BrowserView>
                <MobileView>
                    <MobileMenu />
                </MobileView> 
                <div className="ui hidden divider"></div>
                <Dropzone onDrop={handleDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            <div className="ui button">Drop your files, or click to select files</div>
                        </div>
                    )}
                </Dropzone>
            </div>

            <div className="ui aligned container">
                
                
                <form onSubmit={onSubmit}>
                    {
                        filename !== 'Choose File' ? (
                            <>
                                <h1 className="ui header" style={{textAlign: 'left'}} >Uploading <span className="ui green header "> {uploadPercentage} % </span> </h1>
                                <div className="ui raised segments">
                                    <div className="ui right aligned segment">
                                        <button type="button" onClick={() => cancelFileUpload()} className={'ui red medium button'}>
                                            Cancel
                                        </button>
                                    </div>
                                    { uploadfileName() }
                                </div>
                            </>
                        ) : null
                    }
                </form>


                {/* Share Folder Model */}
                <div id="shareFolderModel" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Share Folder
                    </div>
                    <div className="image content">
                        <div className="description">
                            <form className="ui form">
                                <div className="field">
                                    <label>Email Address</label>
                                    <input required type="text" onChange={(event) => setShareToEmail(event.target.value)} name="first-name" placeholder="Comma Seperated Emails" />
                                </div>
                                <div className="field">
                                    <label>Description <small>(Opstional)</small></label>
                                    <textarea onChange={(event) => setshareDescription(event.target.value)} rows="4"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="actions">
                        <div onClick={() => share()} className="ui positive right labeled icon button">
                            Share
                            <i className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
            {/* Share Folder Model */}



                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
                <div className="ui raised segments">
                    <div className="ui segment violet inverted">
                        <span id="shareFolderBtn" style={{float: 'right', cursor: 'pointer'}}> <i className="share alternate icon large"></i></span>
                        <p style={{'textAlign': 'left'}}><i className="folder open icon"></i>{folderName}</p> 
                    </div>
                </div>

                {
                                    loadingfiles ? (
                                        <>
                                        <div className="ui fluid placeholder">
                                            <div className="paragraph">
                                                <div className="line"></div>
                                                <div className="line"></div>
                                                <div className="line"></div>
                                            </div>
                                            <div className="paragraph">
                                                <div className="line"></div>
                                                <div className="line"></div>
                                                <div className="line"></div>
                                            </div>
                                            <div className="paragraph">
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
                                    <>
                                    {showFolderFileList()}
                                    </>
                                    )
                                }

            </div>
        </Fragment>
    )
}

export default Folder
