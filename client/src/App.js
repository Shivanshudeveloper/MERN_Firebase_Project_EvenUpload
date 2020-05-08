import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  BrowserView,
  MobileView
} from 'react-device-detect';

// Semantic UI
import 'semantic-ui-css/semantic.min.css';

// Components
// @For Rendering in Browser
import EvenUpload from './components/EvenUpload';
import AuthenticationPage from './components/AuthenticationPage';
import FileInfo from './components/FileInfo';
import Scan from './components/Scan';
import Register from './components/Register';
import Photos from './components/Photos';
import QrForDownload from './components/QrForDownload';
import ScanForDownload from './components/ScanForDownload';
import Share from './components/Share';
import Contacts from './components/Contacts';

// @For Rendering Mobile
import MobileScan from './components/MobileView/Scan';
import MobileEvenUpload from './components/MobileView/EvenUpload';
import MobilePhotos from './components/MobileView/Photos';
import MobileScanForDownload from './components/MobileView/MobileScanForDownload';


// Test Component
import Test from './components/Test';

function App() {
  return (
    <Fragment>
        <BrowserView>
          <Router>
            <Route path="/" exact component={AuthenticationPage} />
            <Route path="/register" exact component={Register} />
            <Route path="/home" exact component={EvenUpload} />
            <Route path="/fileinfo" component={FileInfo} />
            <Route path="/scan" exact component={Scan} />
            <Route path="/photos" exact component={Photos} />
            <Route path="/qrcodedownload" exact component={QrForDownload} />
            <Route path="/scanqrdownload" component={ScanForDownload} />
            <Route path="/share" component={Share} />
            <Route path="/inbox" component={Contacts} />
          </Router>
        </BrowserView>

        <MobileView>
            <Router>
              <Route path="/" exact component={AuthenticationPage} />
              <Route path="/register" exact component={Register} />
              <Route path="/home" exact component={MobileEvenUpload} />
              <Route path="/fileinfo" component={FileInfo} />
              <Route path="/scan" exact component={MobileScan} />
              <Route path="/photos" exact component={MobilePhotos} />
              <Route path="/qrcodedownload" exact component={QrForDownload} />
              <Route path="/scanqrdownload" component={MobileScanForDownload} />
              <Route path="/inbox" component={Contacts} />
            </Router>
        </MobileView>
    </Fragment>
    
  );
}

export default App;
