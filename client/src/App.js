import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <Router>
      <div className="container">
        <h2 className="h2 display-4 text-center mt-4 font-weight-bold">
          Even<span className="text-primary" >Upload</span> <i className="fas fa-star text-warning"></i>
        </h2>

        <FileUpload />
      </div>
    </Router>
  );
}

export default App;
