import React, { useState, useEffect, Fragment } from 'react';
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
                    <div style={{float: 'left'}} >
                        <i aria-hidden="true" className="file image alternate big icon purple aligned"></i>{file_name.split("_").pop().substring(0, 12)}....
                    </div>
                ) : (
                    fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'csv' || fileExtension === 'ods' || fileExtension === 'xlsb' || fileExtension === 'tsv' || fileExtension === 'dif' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file excel alternate big icon green aligned"></i>{file_name.split("_").pop().substring(0, 12)}....
                        </div>
                    ) : fileExtension === 'docx' || fileExtension === 'doc' || fileExtension === 'wps' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file word alternate big icon blue aligned"></i>{file_name.split("_").pop().substring(0, 12)}....
                        </div>
                    ) : fileExtension === 'pdf' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file red pdf big icon aligned"></i>{file_name.split("_").pop().substring(0, 12)}....
                        </div>
                    ) : fileExtension === 'pptx' || fileExtension === 'pptm' || fileExtension === 'ppt' || fileExtension === 'pot' || fileExtension === 'ppsx' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file orange powerpoint big icon aligned"></i>{file_name.split("_").pop().substring(0, 12)}....
                        </div>
                    ) : fileExtension === 'mp4' || fileExtension === 'm4a' || fileExtension === 'm4v' || fileExtension === 'f4v' || fileExtension === 'm4b' || fileExtension === 'mov' || fileExtension === 'webm' || fileExtension === 'wmv' || fileExtension === 'mkv' || fileExtension === 'wav' || fileExtension === 'aac' || fileExtension === 'avi' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file olive video big icon aligned"></i>{file_name.split("_").pop().substring(0, 12)}....
                        </div>
                    ) : fileExtension === 'zip' || fileExtension === 'rar' || fileExtension === '7z' || fileExtension === 'tar' || fileExtension === 'tar.gz' || fileExtension === 'iso' || fileExtension === 'gz' || fileExtension === 'jar' || fileExtension === 'bz' || fileExtension === 'tgz'  ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file archive brown big icon aligned"></i>{file_name.split("_").pop().substring(0, 12)}....
                        </div>
                    ) : (
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file grey alternate big icon aligned"></i>{file_name.split("_").pop().substring(0, 12)}....
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
                    <div style={{float: 'left'}}>
                        <i aria-hidden="true" className="file image alternate big icon purple aligned"></i>{file_name.split("_").pop()}
                    </div>
                ) : (
                    fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'csv' || fileExtension === 'ods' || fileExtension === 'xlsb' || fileExtension === 'tsv' || fileExtension === 'dif' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file excel alternate big icon green aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'docx' || fileExtension === 'doc' || fileExtension === 'wps' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file word alternate big icon blue aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'pdf' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file red pdf big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'pptx' || fileExtension === 'pptm' || fileExtension === 'ppt' || fileExtension === 'pot' || fileExtension === 'ppsx' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file orange powerpoint big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'mp4' || fileExtension === 'm4a' || fileExtension === 'm4v' || fileExtension === 'f4v' || fileExtension === 'm4b' || fileExtension === 'mov' || fileExtension === 'webm' || fileExtension === 'wmv' || fileExtension === 'mkv' || fileExtension === 'wav' || fileExtension === 'aac' || fileExtension === 'avi' ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file olive video big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : fileExtension === 'zip' || fileExtension === 'rar' || fileExtension === '7z' || fileExtension === 'tar' || fileExtension === 'tar.gz' || fileExtension === 'iso' || fileExtension === 'gz' || fileExtension === 'jar' || fileExtension === 'bz' || fileExtension === 'tgz'  ? ( 
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file archive brown big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    ) : (
                        <div style={{float: 'left'}} >
                            <i aria-hidden="true" className="file grey alternate big icon aligned"></i>{file_name.split("_").pop()}
                        </div>
                    )
                )
            }
        </div>
    )
}


const RecentFile = ({ data }) => {
    const [file, setFile] = useState({});
    const [file_name, setFileName] = useState('');
    const [file_path, setFilePath] = useState('');


    useEffect(() => {
        var starCountRef = database.ref(`${data}`);
        starCountRef.on('value', function(snapshot) {
            var fileData = snapshot.val();
            setFile(fileData);
            setFileName(fileData.fileName);
            setFilePath(fileData.filePath);
        });
}, []);

    
                    
    
    return (
        <Fragment>
            <div className="ui link card">
                <div className="content">
                    <a href={file_path} target="_blank" download>
                    { 
                        file_name.split('_').pop().length > 12 ? (
                            <FileTrim file_name={file_name} />
                        ) : (
                            <FileNotTrim file_name={file_name} />
                        ) 
                    }
                    </a>
                    <div className="meta">
                        <Link className="right floated" to={`/scanqrdownload/?path=${data}`}>
                            <i className="large qrcode black icon"></i>
                            <br />
                        </Link>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}



export default RecentFile
