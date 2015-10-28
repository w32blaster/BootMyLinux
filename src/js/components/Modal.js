var React = require('react');

module.exports = React.createClass({
  
  getInitialState: function() {
    return {
      isModalWindowShown: false,
      items: []
    };
  },

  show: function(items) {
    this.setState({ 
      isModalWindowShown: true,
      items: items
    })
  },

  close: function() {
    this.setState({ isModalWindowShown: false})
  },

  render: function() {
    if (this.state.isModalWindowShown) {

      var displayed = []
      for (var i=0; i<this.state.items.length; i++) {
          displayed.push (
              <p> Application {this.state.items[i].name}</p>
          )
      }

      return (
         <div id="modal-background">
            <div id="dialog-content">
              <button onClick={this.close}>[x] Close</button>

              <h1>Modal Window</h1>
              <p>Here is your script. Copy that content and save as .sh script. Then execute it and relax!</p>
              <pre id="ready-script">
                  
                 <p>#!/bin/bash</p>

                 <p>
                    # check the SUDO privileges<br />
                    if [ `id -u` -eq 0 ]<br />
                    then<br />
                    &nbsp;   echo "Hi there! This script will install software for you. Enjoy!"<br />
                    else<br />
                    &nbsp;   echo "This script must be execused with a SUDO preveleges! Program will be stopped."<br />
                    &nbsp;   exit 1<br />
                    fi<br />
                 </p>

                 <p>
                   apt-get update<br />
                   apt-get upgrade -y<br />
                   apt-get dist-upgrade -y<br />
                   apt-get autoremove -y<br />
                 </p>

                 {displayed}

              </pre>
            </div>
         </div>
      )
    }
    else {
      return (
          <div id="modal-holder">&nbsp;</div>
        )
    }
  }
});