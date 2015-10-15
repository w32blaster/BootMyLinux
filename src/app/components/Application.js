import React from 'react';

/**
 * Application
 * one single suggestion for a program,
 * displayed as a single card
 **/
export default React.createClass({

  getInitialState: function() {
    return {data: []};
  },
  
  render: function() {
    return (
      <div className="application">
        <h1>{this.props.title}</h1>
        <p></p>
      </div>
    );
  }
});