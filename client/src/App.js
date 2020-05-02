import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Components
import EvenUpload from "./components/EvenUpload";
import AuthenticationPage from "./components/AuthenticationPage";
import FileInfo from "./components/FileInfo";
import Scan from './components/Scan';

function App() {
  return (
    <Router>
      <Route path="/" exact component={AuthenticationPage} />
      <Route path="/home" exact component={EvenUpload} />
      <Route path="/fileinfo" component={FileInfo} />
      <Route path="/scan" exact component={Scan} />
    </Router>
  );
}

export default App;
