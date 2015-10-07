/**
 * One single suggestion 
 **/
var Application = React.createClass({

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