import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  BrowserView,
  MobileView
} from 'react-device-detect';

// Components
// @For Rendering in Browser
import EvenUpload from './components/EvenUpload';
import AuthenticationPage from './components/AuthenticationPage';
import FileInfo from './components/FileInfo';
import Scan from './components/Scan';
import Register from './components/Register';
import Photos from './components/Photos';

// @For Rendering Mobile
import MobileScan from './components/MobileView/Scan';
import MobileEvenUpload from './components/MobileView/EvenUpload';
import MobilePhotos from './components/MobileView/Photos';

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
            </Router>
        </MobileView>
    </Fragment>
    
  );
}

export default App;
