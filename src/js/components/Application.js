var React = require('react');

/**
 * One single suggestion.
 * It looks like a simple card in the UI that could be moved from one
 * column to another
 **/
module.exports = React.createClass({

  getInitialState: function() {
    return {
      isDescriptionShown: false,
    };
  },

  _indexOfCaseInsensitive: function(value, text) {
      return text ? value.toUpperCase().indexOf(text.toUpperCase()) : -1;
  },

  _highlighted: function(value, text) {
      var startIdx = this._indexOfCaseInsensitive(value, text);
      if(!text || !text.trim() || startIdx === -1) {
        return value;
      }
      else {
        var endIdx = startIdx + text.length;
        return [value.substring(0, startIdx), <b>{text}</b>, value.substring(endIdx)];
      }
  },

  onToggle: function(evt) {
      this.setState({
        isDescriptionShown: !this.state.isDescriptionShown
      });
  },

  onClick: function(evt) {
    this.props.onButtonClick(this.props.app);
  },

  onTagClick: function(evt) {
    document.getElementById("search-field").value = "#" + evt.currentTarget.innerText;
  },

  render: function() {

    var tags = []
    var hTag = this.props.highlightedTag ? this.props.highlightedTag.substring(1) : "";
    for (var i = 0; i < this.props.app.tags.length; i++)
    {
        if (this.props.app.tags[i] === hTag) {
            tags.push(
              <span className="tag highlighted">{this.props.app.tags[i]}</span> 
            )
        }
        else {
           tags.push(
              <span className="tag" onClick={this.onTagClick}>{this.props.app.tags[i]}</span> 
           )
        }
    }

    var descriptionClass = this.state.isDescriptionShown ? "description shown" : "description";

    if (this.props.isTextHighlighted) {
      return (
        
          // Searchable applications, could be highlighted
          <div className="application" id={"app" + this.props.app.id}>
            <h1>{this._highlighted(this.props.app.name, this.props.highlightText)}</h1>
            <p className="short-description">{this._highlighted(this.props.app.description, this.props.highlightText)}</p>

            <button className="appDesriptionExpand" onClick={this.onToggle}>[↓]</button>
            <p className={descriptionClass}>{this._highlighted(this.props.app.descriptionLong, this.props.highlightText)}</p>
            
            <p>{tags}</p>
            
            <button className="appAddBtn" onClick={this.onClick}>[+ Add]</button>
          </div>
      );

    }
    else {

      // simple applications
      return (
          <div className="application" id={"app" + this.props.app.id}>
            <h1>{this.props.app.name}</h1>
            <p className="short-description">{this._highlighted(this.props.app.description, this.props.highlightText)}</p>

            <button className="appDesriptionExpand" onClick={this.onToggle}>[↓]</button>
            <p className={descriptionClass}>{this.props.app.descriptionLong}</p>

            <p>{tags}</p>
            <button className="appAddBtn" onClick={this.onClick}>[- Remove]</button>
          </div>
      );

    }

  }
});