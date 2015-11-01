var React = require('react');
var ReadyScript = require('./ReadyScript.js');

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
          displayed.push(this.state.items[i].id);
      }

      return (
         <div id="modal-background">
            <div id="dialog-content">
              <button onClick={this.close}>[x] Close</button>

              <h1>Modal Window</h1>
              <p>Here is your script. Copy that content and save as .sh script. Then execute it and relax!</p>
              
              <ReadyScript items={displayed} />
              
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