var React = require('react');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      items: []
    };
  },


  _setState: function(selectedApps) {
    this.setState({
          items: selectedApps
        });
  },


  componentDidMount: function() {
      var self = this;  
      var usedIds = this.props.items;  
      var req = new XMLHttpRequest();
      req.open('GET', 'debian.json');
      var selectedApps = [];
      req.onload = function() {

        if (req.status !== 200) {
          throw new Error('nope');
        }

        var json = JSON.parse(req.response);
            
        // collect instructions for selected apps
        for(var key in json) {
          if(usedIds.indexOf(json[key].id) > -1) {

            var commands = [];
            for (var i in json[key].commands) {
              commands.push(
                <span>{json[key].commands[i]}<br /></span>
              );
            }

            selectedApps.push(
                <p>
                    {commands}
                </p>
            );
          }
        }

        self._setState(selectedApps);    

      };

      req.send();
  },

  render: function() {

    return (
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

                 {this.state.items}

              </pre>
              );
  }

});