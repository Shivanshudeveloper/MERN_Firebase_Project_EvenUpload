import React, { useState, useEffect, Fragment } from 'react';

// Firebase
import { database } from '../Firebase/index';

// Component
import RecentFile from "./RecentFile";
import PhotoFile from './PhotoFile';
import PdfFile from './PdfFile';
import DocsFile from './DocsFile';
import ExcelFile from './ExcelFile';
import ZipFile from './ZipFile';


const RecentsFIles = ({ userId }) => {

    const [allData, setAllData] = useState({});

    useEffect(() => {
        database.ref(`files/${userId}`).orderByValue().limitToLast(10).once('value', function(snapshot) {
            setAllData(snapshot.val());
        });
    }, []);


    return (
        <Fragment>
            {/* Photo Model */}
                <div id="photoModelFiles" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Profile Picture
                    </div>
                    <div className="image content">
                        <div className="description">
                                <div className="ui five stackable cards">
                                { allData ? (
                                    (Object.keys(allData)).map((data) => (
                                        <PhotoFile key={data} data={`files/${userId}/${data}`} />
                                    ))
                                    ) : null 
                                }
                                </div>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui black deny button">
                            Close
                        </div>
                    </div>
                </div>
            {/* Photo Model */}

            {/* PDF Model */}
            <div id="pdfModelFiles" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        PDF
                    </div>
                    <div className="image content">
                        <div className="description">
                                <div className="ui four stackable cards">
                                { allData ? (
                                    (Object.keys(allData)).map((data) => (
                                        <PdfFile key={data} data={`files/${userId}/${data}`} />
                                    ))
                                    ) : null 
                                }
                                </div>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui black deny button">
                            Close
                        </div>
                    </div>
                </div>
            {/* PDF Model */}

            {/* DOCS Model */}
            <div id="docsModelFiles" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        DOCS
                    </div>
                    <div className="image content">
                        <div className="description">
                                <div className="ui four stackable cards">
                                { allData ? (
                                    (Object.keys(allData)).map((data) => (
                                        <DocsFile key={data} data={`files/${userId}/${data}`} />
                                    ))
                                    ) : null 
                                }
                                </div>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui black deny button">
                            Close
                        </div>
                    </div>
                </div>
            {/* DOCS Model */}

            {/* EXCEL Model */}
            <div id="excelModelFiles" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Excel
                    </div>
                    <div className="image content">
                        <div className="description">
                                <div className="ui four stackable cards">
                                { allData ? (
                                    (Object.keys(allData)).map((data) => (
                                        <ExcelFile key={data} data={`files/${userId}/${data}`} />
                                    ))
                                    ) : null 
                                }
                                </div>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui black deny button">
                            Close
                        </div>
                    </div>
                </div>
            {/* EXCEL Model */}

            {/* ZIP Model */}
            <div id="zipModelFiles" className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Zip
                    </div>
                    <div className="image content">
                        <div className="description">
                                <div className="ui four stackable cards">
                                { allData ? (
                                    (Object.keys(allData)).map((data) => (
                                        <ZipFile key={data} data={`files/${userId}/${data}`} />
                                    ))
                                    ) : null 
                                }
                                </div>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui black deny button">
                            Close
                        </div>
                    </div>
                </div>
            {/* ZIP Model */}


            <div className="ui five stackable cards">

                <div id="photoModel" className="ui link card">
                    <div className="content">
                        <i aria-hidden="true" className="file image alternate big icon purple aligned"></i> Photos
                    </div>
                </div>

                <div id="pdfModel" className="ui link card">
                    <div className="content">
                        <i aria-hidden="true" className="file red pdf big icon aligned"></i> PDF
                    </div>
                </div>

                <div id="docsModel" className="ui link card">
                    <div className="content">
                        <i aria-hidden="true" className="file word alternate big icon blue aligned"></i> DOCS
                    </div>
                </div>

                <div id="excelModel" className="ui link card">
                    <div className="content">
                        <i aria-hidden="true" className="file excel alternate big icon green aligned"></i> Excel
                    </div>
                </div>

                <div id="zipModel" className="ui link card">
                    <div className="content">
                        <i aria-hidden="true" className="file archive brown big icon aligned"></i> Zip
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default RecentsFIles
