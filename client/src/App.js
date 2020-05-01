import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Components
import EvenUpload from "./components/EvenUpload";
import AuthenticationPage from "./components/AuthenticationPage";
import FileInfo from "./components/FileInfo";

function App() {
  return (
    <Router>
      <Route path="/" exact component={AuthenticationPage} />
      <Route path="/home" exact component={EvenUpload} />
      <Route path="/fileinfo" component={FileInfo} />
    </Router>
  );
}

export default App;
