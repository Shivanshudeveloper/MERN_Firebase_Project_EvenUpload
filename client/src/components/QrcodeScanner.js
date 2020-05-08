import React, { Component } from 'react';
import QrReader from 'react-qr-reader';

// Component
import Messages from './Messages';
import Menu from './Menu';

export default class QrcodeScanner extends Component {
    constructor () {
        super()
    }


  state = {
    result: '',
    msg: ''
  }
 
  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      })
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
      <div>
      <Menu />
      <div className="ui hidden divider"></div>
      <center>
        { this.state.msg ? <Messages msg={this.state.msg} /> : null }
            {
                this.state.result === '' ? (
                    this.state.msg !== '' ? (
                      <button onClick={this.requestForCamera} className="ui primary button">
                        Request for Scan 
                      </button>
                    ) : null
                ) : (
                    <a className="ui green button" href={this.state.result}>
                        <i className="cloud download icon"></i>
                        Download
                    </a>
                )
            }
            <div className="ui hidden divider"></div>
            <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '50%' }}
            />
        </center>
      </div>
    )
  }
}