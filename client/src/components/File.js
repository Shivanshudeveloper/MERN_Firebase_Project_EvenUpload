import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
// Firebase
import { database } from '../Firebase/index';

import { Link } from 'react-router-dom';

const FileTrim = ({ file_name }) => {
    var fileExtension = file_name.split('.').pop();
    console.log(fileExtension);
    return (
        <div>
            {
                fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg' ? (
                    <div>
                        <i aria-hidden="true" className="file image alternate big icon purple aligned"></i>{file_name.split("_").pop().substring(0, 40)}....
                    </div>
                ) : (
                    fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'csv' || fileExtension === 'ods' || fileExtension === 'xlsb' || fileExtension === 'tsv' || fileExtension === 'dif' ? ( 
                        <div>
                            <i aria-hidden="true" className="file excel alternate big icon green aligned"></i>{file_name.split("_").pop().substring(0, 40)}....
                        </div>
                    ) : fileExtension === 'docx' || fileExtension === 'doc' || fileExtension === 'wps' ? ( 
                        <div>
                            <i aria-hidden="true" className="file word alternate big icon blue aligned"></i>{file_name.split("_").pop().substring(0, 40)}....
                        </div>
                    ) : fileExtension === 'pdf' ? ( 
                        <div>
                            <i aria-hidden="true" className="file red pdf big icon aligned"></i>{file_name.split("_").pop().substring(0, 40)}....
                        </div>
                    ) : fileExtension === 'pptx' || fileExtension === 'pptm' || fileExtension === 'ppt' || fileExtension === 'pot' || fileExtension === 'ppsx' ? ( 
                        <div>
                            <i aria-hidden="true" className="file orange powerpoint big icon aligned"></i>{file_name.split("_").pop().substring(0, 40)}....
                        </div>
                    ) : fileExtension === 'mp4' || fileExtension === 'm4a' || fileExtension === 'm4v' || fileExtension === 'f4v' || fileExtension === 'm4b' || fileExtension === 'mov' || fileExtension === 'webm' || fileExtension === 'wmv' || fileExtension === 'mkv' || fileExtension === 'wav' || fileExtension === 'aac' || fileExtension === 'avi' ? ( 
                        <div>
                            <i aria-hidden="true" className="file olive video big icon aligned"></i>{file_name.split("_").pop().substring(0, 40)}....
                        </div>
                    ) : fileExtension === 'zip' || fileExtension === 'rar' || fileExtension === '7z' || fileExtension === 'tar' || fileExtension === 'tar.gz' || fileExtension === 'iso' || fileExtension === 'gz' || fileExtension === 'jar' || fileExtension === 'bz' || fileExtension === 'tgz'  ? ( 
                        <div>
                            <i aria-hidden="true" className="file archive brown big icon aligned"></i>{file_name.split("_").pop().substring(0, 40)}....
                        </div>
                    ) : (
                        <div>
                            <i aria-hidden="true" className="file grey alternate big icon aligned"></i>{file_name.split("_").pop().substring(0, 40)}....
                        </div>
                    )
                )
            }
        </div>
    )
}

const FileNotTrim = ({ file_name }) => {
    var fileExtension = file_name.split('.').pop();
    return (
        <div>
            {
                fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg' ? (
                    <div>
                        <i aria-hidden="true" className="file image alternate big icon purple aligned"></i>{file_name.split("_").pop()}
                    </div>
                ) : (
                    fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'csv' || fileExtension === 'ods' || fileExtension === 'xlsb' || fileExtension === 'tsv' || fileExtension === 'dif' ? ( 
                        <div>
                            <i aria-hidden="true" className="file excel alternate big icon green aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'docx' || fileExtension === 'doc' || fileExtension === 'wps' ? ( 
                        <div>
                            <i aria-hidden="true" className="file word alternate big icon blue aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'pdf' ? ( 
                        <div>
                            <i aria-hidden="true" className="file red pdf big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'pptx' || fileExtension === 'pptm' || fileExtension === 'ppt' || fileExtension === 'pot' || fileExtension === 'ppsx' ? ( 
                        <div>
                            <i aria-hidden="true" className="file orange powerpoint big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'mp4' || fileExtension === 'm4a' || fileExtension === 'm4v' || fileExtension === 'f4v' || fileExtension === 'm4b' || fileExtension === 'mov' || fileExtension === 'webm' || fileExtension === 'wmv' || fileExtension === 'mkv' || fileExtension === 'wav' || fileExtension === 'aac' || fileExtension === 'avi' ? ( 
                        <div>
                            <i aria-hidden="true" className="file olive video big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'zip' || fileExtension === 'rar' || fileExtension === '7z' || fileExtension === 'tar' || fileExtension === 'tar.gz' || fileExtension === 'iso' || fileExtension === 'gz' || fileExtension === 'jar' || fileExtension === 'bz' || fileExtension === 'tgz'  ? ( 
                        <div>
                            <i aria-hidden="true" className="file archive brown big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : (
                        <div>
                            <i aria-hidden="true" className="file grey alternate big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    )
                )
            }
        </div>
    )
}


const File = ({ data }) => {
    const [file, setFile] = useState({});
    const [file_name, setFileName] = useState('');
    const [file_path, setFilePath] = useState('');


    useEffect(() => {
        var starCountRef = database.ref(`${data}`);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            setFile(fileData);
            var name = fileData.fileName;
            var publicSharingURL = `https://storage.googleapis.com/aicte-admin-survey.appspot.com/uploads/${name}`;
            var dynamicLinkApi = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyCVVlRXx3gRLIs6LiBlWAQuq9UjSUnb5Ms`;

            // Make a Request to Firebase Dynamic Links for the URL
            axios.post(dynamicLinkApi, {
                longDynamicLink: `https://evencloud.page.link/?link=${publicSharingURL}`
            }).then((res) => {
                setFilePath(res.data.shortLink);
            })
            setFileName(fileData.fileName);
        });
}, []);

    
                    
    
    return (
        <Fragment>
            <div role="listitem" className="item">
                <div className="content">
                    <Link className="header" to={`/fileinfo?name=${file_name}&fileId=${data}`}>
                        { file_name.split('_').pop().length > 40 ? (
                            <FileTrim file_name={file_name} />
                        ) : (
                            <FileNotTrim file_name={file_name} />
                        ) }
                    </Link>

                    <div style={{marginBottom: '5px'}} className="ui right aligned">
                        <Link className="right floated" to={`/scanqrdownload/?path=${data}`}>
                            <i className="large qrcode icon"></i>
                            <br />
                        </Link>
                        
                        <a href={file_path} className="right floated" target="_blank" download>
                            <i className="large grey download icon"></i>
                            <br />
                        </a>
                    </div>
                </div>

            </div>
            
        </Fragment>
    )
}



export default File
