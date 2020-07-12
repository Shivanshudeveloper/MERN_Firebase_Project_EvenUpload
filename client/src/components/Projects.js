import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import Dropzone from 'react-dropzone';
import { v4 as uuid4 } from 'uuid';
import CryptoJS from 'crypto';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'semantic-ui-react';
import {
    BrowserView,
    MobileView
  } from 'react-device-detect';

// Component
import Menu from './Menu';
import MenuMobile from './MobileView/Menu';
import User from './User';
// API Service
import { API_SERVICE, SECRET_KEY } from '../config/URI';

// React Notification Toast
import { useToasts } from 'react-toast-notifications';

// Firebase
import { auth, storage } from '../Firebase/index';

// For File Uploading component 
const FileName = ({ f }) => {
    return (
        <>
            <div className="ui left aligned segment">
                <div style={{marginRight: '4px'}} className="ui active small inline loader"></div> {f.name}
            </div>
        </>
    )
}

const AboutProjectModalWindow = ({ aboutProject, createdOnProject, ownerProject }) => {
    return (
    <Modal trigger={<button className="ui icon button left floated">
                        <i className="info icon blue"></i>
                    </button>} 
                    >
      <Modal.Header>About Project</Modal.Header>
      <Modal.Content>
        <Modal.Description>
        {
            aboutProject !== '' ? (
                <>
                <h4 className="ui header">Created On: {createdOnProject}</h4>
                <h4 className="ui header">About</h4>
                <p>
                    {aboutProject}
                </p>
                <h4 className="ui header">Owner: {ownerProject}</h4>
                </>
                ) : (
                <>
                <h4 className="ui header">Created On: {createdOnProject}</h4>
                <h4 className="ui header">Owner: {ownerProject}</h4>
                </>
                )
        }
        </Modal.Description>
      </Modal.Content>
    </Modal>
    )
  }


  const ForwardProjectModalWindow = ({ setShareToEmail, setshareDescription, share, showModal, setshowModal }) => {
    return (
    <Modal open={showModal} trigger={<button onClick={() => setshowModal(true)} className="ui blue button right floated right labeled icon">
                        <i className="right arrow icon"></i>
                        Forward Project File
                    </button>}>
      <i onClick={() => setshowModal(false)} className="close icon"></i>
      <Modal.Header>Share Project</Modal.Header>
      <Modal.Content>
        <Modal.Description>
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
            
        </Modal.Description>
      </Modal.Content>
        <Modal.Actions>
            <button onClick={() => share()} className="ui positive right labeled icon button">
                Share
                <i className="checkmark icon"></i>
            </button>
        </Modal.Actions>
    </Modal>
    )
  }


  const AddNoteModalWindow = ({ userphotoURL, userDisplayName, setNote, showModalNote, setshowModalNote, addNote }) => {
    return (
    <Modal open={showModalNote} trigger={<button onClick={() => setshowModalNote(true)} className="ui icon button left floated green">
                                        <i className="sticky note icon"></i> Add a Note
                                    </button>}>
      <i onClick={() => setshowModalNote(false)} className="close icon"></i>
      <Modal.Header>Note</Modal.Header>
      <Modal.Content>
        <Modal.Description>
            <form className="ui form">
                <div className="field">
                    <img class="ui avatar image" src={userphotoURL} /> {userDisplayName}
                    </div>
                <div className="field">
                    <label>Note</label>
                    <textarea onChange={(event) => setNote(event.target.value)} rows="4"></textarea>
                </div>
            </form>
        </Modal.Description>
      </Modal.Content>
        <Modal.Actions>
            <div onClick={() => addNote()} className="ui positive right labeled icon button">
                Add Note
                <i className="checkmark icon"></i>
            </div>
        </Modal.Actions>
    </Modal>
    )
  }

const AllNotesList = ({ notes }) => {
    return (
        <>
        <div className="ui segment">
            <div style={{marginBottom: '10px'}} className="ui left aligned">
                <img class="ui avatar image" src={notes.userphotoURL} /> {notes.userDisplayName}
                <p style={{marginLeft: '34px', marginTop: '4px'}}>
                    {notes.note}
                </p>
            </div>
        </div>
        </>
    )
}

const ProjectFileList = ({ file, projectId, markFile }) => {

    var mykey = CryptoJS.createCipher('aes-128-cbc', SECRET_KEY);
    var eE = mykey.update(file.fileName, 'utf8', 'hex');
    eE += mykey.final('hex');

    var mykey2 = CryptoJS.createCipher('aes-128-cbc', SECRET_KEY);
    var eE2 = mykey2.update(projectId, 'utf8', 'hex');
    eE2 += mykey2.final('hex');

    var mykeyd = CryptoJS.createCipher('aes-128-cbc', SECRET_KEY);
    var eEd = mykeyd.update(file.filePath, 'utf8', 'hex');
    eEd += mykeyd.final('hex');

    var fileName = file.fileName;
    var fileComment = file.comments;
    if (fileName.length > 32) {
        fileName = fileName.substring(0, 32) + '....';
    }

    if (fileComment.length > 84) {
        fileComment = fileComment.substring(0, 84) + '....';
    }
    
    return (
        <>
            <tr>
                <td className="four wide">
                    <Link to={`/projectfiletrack?f=${eE}&p=${eE2}&d=${eEd}`}>
                        <i className="file outline icon"></i> { fileName }
                    </Link>
                </td>
                <td>
                    <img className="ui avatar image" src={file.userphotoURL} />  {fileComment}
                </td>
                <td className="right aligned one wide">{ file.uploadedAt }</td>
            </tr>
        </>
    )
}

const Projects = ({ location }) => {
    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 
    let userEmail = sessionStorage.getItem("userEmail");

    const { addToast } = useToasts();

    const [project, setProject] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectId, setProjectId] = useState('');
    const [file, setFile] = useState([]);
    const [filename, setFilename] = useState('Choose File');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [loadingfiles, setLoadingFiles] = useState(true);
    const [userphotoURL, setUserPhotoURL] = useState('');
    const [userDisplayName, setUserDisplayName] = useState('');
    const [aboutProject, setAboutProject] = useState('');
    const [ownerProject, setOwnerProject] = useState('');
    const [createdOnProject, setCreatedOnProject] = useState('');
    const [commented, setCommented] = useState(false);
    const [comments, setComments] = useState('');
    const [projectPid, setProjectPid] = useState('');
    const [note, setNote] = useState('');
    const [allNotes, setAllNotes] = useState([]);

    let [showModal, setshowModal] = useState(false);
    let [showModalNote, setshowModalNote] = useState(false);

    let [shareToEmail, setShareToEmail] = useState('');
    const [shareDescription, setshareDescription] = useState('');

    // Getting the pid and project name from url
    const { pid } = queryString.parse(location.search);
    var mykey = CryptoJS.createDecipher('aes-128-cbc', SECRET_KEY);
    var dE = mykey.update(pid, 'hex', 'utf8');
    dE += mykey.final('utf8');

    useEffect(() => {
        if (file.length > 0) {
            // onSubmit();
        } else {
            console.log("N");
        }
    }, [file]);

    useEffect(() => {

        setProjectId(dE);

        axios.get(`${API_SERVICE}/api/v1/readwrite/projectfilelist/${dE}/${userId}`)
        .then(response => {
            setProject(response.data);
            setLoadingFiles(false);
        })

        axios.get(`${API_SERVICE}/api/v1/readwrite/aboutproject/${dE}/${userId}`)
        .then(response => {
            setAboutProject(response.data.description);
            setOwnerProject(response.data.email);
            setCreatedOnProject(response.data.createdAt);
            setProjectName(response.data.projectName);
            setProjectPid(response.data.pid);
        })

        axios.get(`${API_SERVICE}/api/v1/readwrite/showNotes/${dE}`)
        .then(response => {
            setAllNotes(response.data);
        })

        auth.onAuthStateChanged(function(user) {
            if (user) {
                setUserPhotoURL(user.photoURL);
                setUserDisplayName(user.displayName);
            } else {
                console.log("No");
                window.location.href = "/";
            }
        });
    }, []);

    const refreshData = () => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/projectfilelist/${projectId}/${userId}`)
        .then(response => {
            setProject(response.data);
        })
    }

    const refreshNotes = () => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/showNotes/${projectId}`)
        .then(response => {
            setAllNotes(response.data);
        })
    }

    

    const onSubmit = () => {
        // e.preventDefault();
        if (file.length > 0) {
            // Generate the Date
            if (comments === '') {
                addToast(`Please comment the file`, { appearance: 'error', autoDismiss: true })
            } else {
                setCommented(true);
                var date = new Date();
                var dd = String(date.getDate()).padStart(2, '0');
                var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = date.getFullYear();
                date = dd + '/' + mm + '/' + yyyy;
                file.forEach(file => {
                    var uniquetwoKey = uuid4() + '_FILE_' + Date.now();

                    const uploadTask = storage.ref(`projects/${uniquetwoKey}/${file.name}`).put(file);
                    

                    uploadTask.on('state_changed', (snapshot) => {
                        const progress =  Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setUploadPercentage(progress);
                    },
                    (error) => {
                        console.log(error);
                    },
                    async () => {
                        // When the Storage gets Completed
                        const filePath = await uploadTask.snapshot.ref.getDownloadURL();
                        const fileName = `${file.name}`;

                        // Entry in the database
                        const uploadData = {
                            date,
                            projectId,
                            projectName,
                            fileName,
                            filePath,
                            uniquetwoKey,
                            userId,
                            userEmail,
                            userDisplayName,
                            userphotoURL,
                            comments
                        }
                        axios.post(`${API_SERVICE}/api/v1/readwrite/uploadprojectfile`, uploadData)
                            .then((res) => {
                                if (res.status === 200) {
                                    console.log(res.status);
                                    addToast(`${fileName} File Successfully Uploaded`, { appearance: 'success', autoDismiss: true })
                                    setFile([]);
                                    setFilename('Choose File');
                                    setCommented(false);
                                    refreshData();
                                }
                            })
                            .catch(err => console.log(err))
                    });
                })
            }
            
        } else {
            addToast(`No File Selected`, { appearance: 'danger', autoDismiss: true })
        }
   }
    // -----------------------------------------------------------------------------------------------------------
    // Sharing Project
    const share = () => {
        shareToEmail = shareToEmail.split(' ').join('');
        // Saved in Database about the User
        const uploadData = {
            fileName: projectName,
            to: shareToEmail,
            from: userId,
            url: 'PROJECT',
            senders_photoURL: userphotoURL,
            senders_email: userEmail,
            message: shareDescription,
            fileKey: 'NIL',
            fileId: projectId
        }
        setshowModal(false);
        axios.post(`${API_SERVICE}/api/v1/readwrite`, uploadData)
            .then((res) => {
                if (res.status === 200) {
                    addToast(`Project Successfully Shared`, { appearance: 'success', autoDismiss: true });
                }
            })
            .catch(err => console.log(err))

        axios.put(`${API_SERVICE}/api/v1/readwrite/inbox/${userId}/${shareToEmail}`)
            .then(res => console.log(res.status))
            .catch(err => console.log(err))
    }    

    // -----------------------------------------------------------------------------------------------------------
    const cancelFileUpload = () => {
        setFilename('Choose File');
        setFile([]);
        setUploadPercentage(0);
    }
    

    const handleDrop = async (acceptedFiles) => {
        setFile(acceptedFiles.map(file => file));
        setFilename("Files");
    }

    const markFile = () => {
        console.log("D");
    }

    const uploadfileName = () => {
        return file.map(f => {
            return <FileName f={f} key={f} />
        })
    }

    const addNote = () => {
        const uploadData = {
            projectId,
            note,
            userDisplayName,
            userphotoURL
        }
        setshowModalNote(false);
        axios.post(`${API_SERVICE}/api/v1/readwrite/addnote`, uploadData)
        .then((res) => {
            if (res.status === 200) {
                addToast(`Note Successfully Added`, { appearance: 'success', autoDismiss: true });
                refreshNotes();
            }
        })
        .catch(err => console.log(err))
    }

    const showProjectFileList = () => {
        return project.map(file => {
            return <ProjectFileList file={file} markFile={markFile} projectId={projectId} key={file._id} />
        })
    }

    const showNotes = () => {
        return allNotes.map(notes => {
            return <AllNotesList notes={notes} key={notes._id} />
        })
    }

    
    

    return (
        <Fragment>
            <div className="ui center aligned container">
                
                <User />
                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
                <BrowserView>
                    <Menu />
                </BrowserView>
                <MobileView>
                    <MenuMobile />
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

                <form onSubmit={onSubmit}>
                    {
                        filename !== 'Choose File' ? (
                            <>
                                <h1 className="ui header" style={{textAlign: 'left'}} >
                                    {
                                        commented ? (
                                            <>
                                                Uploading <span className="ui green header "> {uploadPercentage} % </span>
                                            </>
                                        ) : (
                                            <>
                                                Comment Your Changes
                                            </>
                                        )
                                    }
                                </h1>
                                <div className="ui fluid action input focus">
                                    <input onChange={(event) => setComments(event.target.value)} type="text" placeholder="Comment Your Changes" />
                                    <div onClick={() => onSubmit()} className="ui green button">Submit</div>
                                </div>
                                <div className="ui raised segments">
                                    <div className="ui right aligned segment">
                                        <button type="button" onClick={() => cancelFileUpload()} className={'ui medium button'}>
                                            Cancel
                                        </button>
                                    </div>
                                    { uploadfileName() }
                                </div>
                            </>
                        ) : null
                    }
                </form>

                <BrowserView>
                    <div className="ui hidden divider"></div>
                    <ForwardProjectModalWindow setShareToEmail={setShareToEmail} setshareDescription={setshareDescription} share={share} showModal={showModal} setshowModal={setshowModal} />
                </BrowserView>
                <MobileView>
                    <div className="ui hidden divider"></div>
                    <button id="shareProjectModelBtn" className="ui circular icon button green right floated">
                        <i className="right arrow icon"></i>
                    </button>
                </MobileView>

                

                {/* Note Model */}
                <div id="addNoteModel" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Note
                    </div>
                    <div className="image content">
                        <div className="description">
                            <form className="ui form">
                                <div className="field">
                                    <img class="ui avatar image" src={userphotoURL} /> {userDisplayName}
                                </div>
                                <div className="field">
                                    <label>Note</label>
                                    <textarea onChange={(event) => setNote(event.target.value)} rows="4"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="actions">
                        <div onClick={() => addNote()} className="ui positive right labeled icon button">
                            Add Note
                            <i className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
                {/* Note Model */}
                <BrowserView>
                    <AddNoteModalWindow userphotoURL={userphotoURL} userDisplayName={userDisplayName} addNote={addNote} setNote={setNote} showModalNote={showModalNote} setshowModalNote={setshowModalNote} />
                    <a href={`/projectsharedwith?pid=${projectId}`} className="ui icon button left floated orange">
                        <i className="users note icon"></i> Track Project File
                    </a>
                    {/* About Project File Model */}
                    <AboutProjectModalWindow aboutProject={aboutProject} createdOnProject={createdOnProject} ownerProject={ownerProject} />
                    {/* About Project File Model */}    

                </BrowserView>
                <MobileView>
                    <button id="addNoteBtn" className="ui circular icon button left floated yellow">
                        <i className="sticky note icon"></i>
                    </button>
                </MobileView>
                
                

            {/* Share Project Model */}
            <div id="shareProjectModel" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Share Project
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
            {/* Share Project Model */}
                
                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
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
                                    <table className="ui celled striped table">
                                    <thead>
                                        <tr>
                                        <th colspan="3">
                                            {projectName}
                                        </th>
                                        </tr>
                                    </thead>
                                        <tbody>
                                            {showProjectFileList()}
                                        </tbody>
                                    </table>
                                    </>
                                    )
                                }

                                
                        <div style={{'textAlign': 'left'}} className="ui segments">
                            <div className="ui inverted segment green">
                                <h4>Notes</h4>
                            </div>
                            {showNotes()}
                        </div>

                    
                      

                    
                    <div className="ui hidden divider"></div>
                    <div className="ui hidden divider"></div>

            </div>
        </Fragment>
    )
}

export default Projects
