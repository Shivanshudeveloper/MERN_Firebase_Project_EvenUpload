import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Components
import EvenUpload from "./components/EvenUpload";
import AuthenticationPage from "./components/AuthenticationPage";

function App() {
  return (
    <Router>
      <Route path="/" exact component={AuthenticationPage} />
      <Route path="/home" exact component={EvenUpload} />
    </Router>
  );
}

export default App;
