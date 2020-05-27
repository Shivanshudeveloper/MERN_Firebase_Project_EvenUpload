import React, { useState, Fragment } from 'react';
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
import AllSaveFiles from './components/AllSaveFiles';
import SavedFiles from './components/SavedFiles';


// @For Rendering Mobile
import MobileScan from './components/MobileView/Scan';
import MobileEvenUpload from './components/MobileView/EvenUpload';
import MobilePhotos from './components/MobileView/Photos';
import MobileScanForDownload from './components/MobileView/MobileScanForDownload';
import MobileContacts from './components/MobileView/MobileContacts';

// Noification Package
import { ToastProvider } from 'react-toast-notifications';

// Theme
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyles } from './styles/global';

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    // if the theme is not light, then set it to dark
    if (theme === 'light') {
      setTheme('dark');
    // otherwise, it should be light
    } else {
      setTheme('light');
    }
  }


  return (
    <Fragment>
      <ToastProvider>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      
      
      <div className="ui container">
        <div style={{marginTop: '10px'}} className="ui toggle checkbox">
          <input onClick={toggleTheme} type="checkbox" />
          <label>{theme === 'light' ? 
              <>
                <i className="moon large icon"></i> 
                Dark Mode
              </>
              : 
              <>
                <i className="sun large yellow icon"></i> 
                <span style={{color: '#ffffff'}}>Light Mode</span>
              </>
            }
          </label>
        </div>
      </div>
      
      <GlobalStyles />
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
            <Route path="/savefiles" exact component={AllSaveFiles} />
            <Route path="/savedfiles" component={SavedFiles} />
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
              <Route path="/share" component={Share} />
              <Route path="/inbox" component={MobileContacts} />
              <Route path="/savefiles" exact component={AllSaveFiles} />
              <Route path="/savedfiles" component={SavedFiles} />
            </Router>
        </MobileView>
      </ThemeProvider>
      </ToastProvider>
    </Fragment>
    
  );
}


export default App;
