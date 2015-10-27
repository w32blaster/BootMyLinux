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
              <p>Here will be some text, yo!</p>
              <pre>
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