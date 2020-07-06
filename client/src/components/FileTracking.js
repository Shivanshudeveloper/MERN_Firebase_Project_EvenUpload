import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';
import axios from 'axios';
import CryptoJS from 'crypto';

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

// Utils
import Empty_Inbox_Temp_Image from  '../utils/no_projects.gif';

const ProjectList = ({ project }) => {

    if (project.ownership == 1) {
        var mykey = CryptoJS.createCipher('aes-128-cbc', SECRET_KEY);
        var eE = mykey.update(project._id, 'utf8', 'hex');
        eE += mykey.final('hex');
    } else {
        var mykey = CryptoJS.createCipher('aes-128-cbc', SECRET_KEY);
        var eE = mykey.update(project.refId, 'utf8', 'hex');
        eE += mykey.final('hex');
    }

    return (
        <>
            <div className="ui left aligned attached segment">
                <p>
                    <a href={`/projects?pid=${eE}&n=${project.projectName}`}>
                        <i className="folder icon"></i> { project.projectName } <span style={{float: 'right'}}>{ project.createdAt }</span>
                    </a>
                </p>
            </div>
        </>
    )
}

const FileTracking = () => {
    // Getting the userid from JS session
    let userId = sessionStorage.getItem("userId"); 
    let sendersEmail = sessionStorage.getItem("userEmail"); 

    const { addToast } = useToasts();

    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_SERVICE}/api/v1/readwrite/projectlist/${userId}`)
        .then(response => {
            setProjects(response.data);
            setLoading(false);
            // console.log(response.data);
        })
        .catch(err => console.log(err))
        console.log(userId);
    }, [])

    const createProject = () => {
        var uniqueKey = uuid4(); 
        uniqueKey =  uniqueKey +'_PRO_' + Date.now();
        // Generate the Date
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        date = dd + '/' + mm + '/' + yyyy;

        // Saved in Database about the User
        const uploadData = {
            date,
            projectName,
            description,
            uniqueKey,
            userId,
            sendersEmail,
            ownership: 1,
            refId: 'NIL'
        }


        axios.post(`${API_SERVICE}/api/v1/readwrite/createproject`, uploadData)
            .then((res) => {
                if (res.status === 201) {
                    addToast(`Project with the name ${projectName} already exist please choose diffrent name`, { appearance: 'info', autoDismiss: true });
                    setProjectName('');
                } else if (res.status === 200) {
                    var mykey = CryptoJS.createCipher('aes-128-cbc', SECRET_KEY);
                    var eE = mykey.update(res.data._id, 'utf8', 'hex');
                    eE += mykey.final('hex');
                    window.location.href = `projects?pid=${eE}&n=${res.data.projectName}`
                }
            })
            .catch(err => console.log(err))
    }

    const showProjectList = () => {
        return projects.map(project => {
            return <ProjectList project={project} key={project._id} />
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
            </div>

            {/* CreateNewProject Model */}
            <div id="createNewProjectModel" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Create New Project File
                    </div>
                    <div className="image content">
                        <div className="description">
                            <form className="ui form">
                                <div className="field">
                                    <label>Project Name</label>
                                    <input required type="text" value={projectName} onChange={(event) => setProjectName(event.target.value)} name="first-name" placeholder="First Project" />
                                </div>
                                <div className="field">
                                    <label>Description <small>(Opstional)</small></label>
                                    <textarea onChange={(event) => setDescription(event.target.value)} rows="4"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="actions">
                        <div onClick={() => createProject()} className="ui positive right labeled icon button">
                            Create
                            <i className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
            {/* CreateNewProject Model */}

            <div className="ui container">
                <button id="createNewProjectBtn" style={{float: 'left'}} className="ui blue button" to="/filetrack" >
                    Create a new Project File
                </button>

                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>
                <div className="ui hidden divider"></div>

                
                
                <div role="list" className="ui raised segments">
                    <div className="ui violet inverted segment">
                        <span style={{float: 'right'}}> <i className="history icon"></i> History </span>
                        <p>
                            <i style={{marginRight: '10px'}} className="folder icon"></i>
                            Project Files
                        </p> 
                    </div>
                </div>
                    {
                        loading ? (
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
                        ) : (
                            projects === undefined || projects.length === 0 ? (
                                <center>
                                    <img className="ui big image" src={Empty_Inbox_Temp_Image} />
                                </center>
                            ) : (
                                <>
                                {showProjectList()}
                                </>
                            )
                        )
                        
                    }
                    
                </div>
        </Fragment>
    )
}

export default FileTracking
