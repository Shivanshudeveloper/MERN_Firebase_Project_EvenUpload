import React, { Component, Fragment } from 'react';
import QrReader from 'react-qr-reader';
import queryString from 'query-string';
import { database } from "../../Firebase/index";

// Component
import Messages from '../Messages';
import Menu from './Menu';
import User from "../User";

export default class ScanForDownload extends Component {
    constructor (props) {
        super(props);

        this.state = {
          filepath: ''
        };
    }
    

    componentDidMount() {
        const { path } = queryString.parse(this.props.location.search);
        console.log(path);
        
        const ref = database.ref(path);

        const getData = (ref) => {
          return new Promise((resolve, reject) => {
            const onData = (snap) => resolve(snap.val());
        
            ref.on("value", onData);
          });
        };
        
        getData(ref)
          .then((value) => {
            this.setState({
              filepath: value.filePath
            })
          })
          .catch((error) => {
            // reject() was called
            // Something went wrong while fetching the data.
            // Handle that error here.
          });


    }

    

 
  handleScan = data => {
    if (data) {

        var updates = {
            filePath: this.state.filepath
        };
        console.log(this.state.filepath);

        database.ref(`qr/${data}/`).update(updates).then(() => {
            console.log("S");
        })
        .catch(err => console.log(err));
    }
  }
  handleError = err => {
    this.setState({
      msg: 'Camera Permissions not allowed please allow the Permission and Refresh the Page'
    })
  }

  requestForCamera = () => {
    navigator.mediaDevices.getUserMedia({video: true}).then((s) => {
        console.log(s)
    })
    .catch((err) => {
      this.setState({
        msg: 'Camera Permissions not allowed please allow the Permission and Refresh the Page'
      })
    })
  }

  render() {
    return (
      <Fragment>
        <div className="ui center aligned container">
            <User />
            <div className="ui hidden divider"></div>
            <Menu />
            <div className="ui hidden divider"></div>

            <center>
                { this.state.msg ? <Messages msg={this.state.msg} /> : null }
                <div className="ui hidden divider"></div>
                <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                />
            </center>
            </div>
        </Fragment>
    )
  }
}