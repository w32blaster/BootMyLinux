var React = require('react');

/**
 * One single suggestion 
 **/
var Application = React.createClass({

  _indexOfCaseInsensitive: function(value, text) {
      return value.toUpperCase().indexOf(text.toUpperCase());
  },

  _highlighted: function(value, text) {
      var startIdx = this._indexOfCaseInsensitive(value, text);
      if(!text.trim() || startIdx === -1) {
        return value;
      }
      else {
        var endIdx = startIdx + text.length;
        return [value.substring(0, startIdx), <b>{text}</b>, value.substring(endIdx)];
      }
  },

  onClick: function(evt) {
    this.props.onButtonClick(this.props.app);
  },

  render: function() {

    var tags = []
    this.props.app.tags.forEach(function(tag){
        tags.push(
            <span className="tag">{tag}</span> 
        )
    });

    if (this.props.isTextHighlighted) {

      return (
        <li>
          <div className="application">
            <p>{this._highlighted(this.props.app.name, this.props.highlightText)}</p>
            <p>{this._highlighted(this.props.app.description, this.props.highlightText)}</p>
            <p>{tags}</p>
            <button onClick={this.onClick}>[+ Add]</button>
          </div>
        </li>
      );

    } else {

      return (
        <li>
          <div className="application">
            <p>{this.props.app.name}</p>
            <p>{this.props.app.description}</p>
            <p>{tags}</p>
            <button onClick={this.onClick}>[- Remove]</button>
          </div>
        </li>
      );

    }

  }
});