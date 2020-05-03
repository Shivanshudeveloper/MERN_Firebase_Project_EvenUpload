import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  BrowserView,
  MobileView
} from 'react-device-detect';

// Components
import EvenUpload from './components/EvenUpload';
import AuthenticationPage from './components/AuthenticationPage';
import FileInfo from './components/FileInfo';
import Scan from './components/Scan';
import Register from './components/Register';

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
          </Router>
        </BrowserView>
        <MobileView>
            <Router>
              <Route path="/" exact component={AuthenticationPage} />
              <Route path="/home" exact component={EvenUpload} />
              <Route path="/fileinfo" component={FileInfo} />
              <Route path="/scan" exact component={Scan} />
            </Router>
        </MobileView>
    </Fragment>
    
  );
}

export default App;
