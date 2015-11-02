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
        var ii = 0;    
        // collect instructions for selected apps
        for(var key in json) {

          if(typeof usedIds[json[key].id] !== "undefined") {
            var commands = [];
            for (var i in json[key].commands) {
              commands.push(
                <span>{json[key].commands[i]}<br /></span>
              );
            }

            selectedApps.push(
                <p>
                    <span className="comment">
                    #<br />
                    # {ii++}. Install "{usedIds[json[key].id]}"<br />
                    #<br />
                    </span>
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
                  
                 <p>
                    <span className="comment">#!/bin/bash</span>
                 </p>

                 <p>
                    <span className="comment">
                        # check the SUDO privileges<br />
                    </span>
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
                 </p>

                 {this.state.items}

                 <p>
                    apt-get autoremove -y<br />
                    apt-get autoclean -y<br />
                 </p>

              </pre>
              );
  }

});