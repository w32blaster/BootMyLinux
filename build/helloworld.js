/**
 * One single suggestion 
 **/
'use strict';

var Application = React.createClass({
  displayName: 'Application',

  getInitialState: function getInitialState() {
    return { data: [] };
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'application' },
      React.createElement(
        'h1',
        null,
        this.props.title
      ),
      React.createElement('p', null)
    );
  }
});

ReactDOM.render(React.createElement('h1', null, 'Hello, world!!!'), document.body);