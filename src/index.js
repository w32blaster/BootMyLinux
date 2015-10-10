/**
 * One single suggestion 
 **/
var Application = React.createClass({

  getInitialState: function() {
      return {data: []};
  },

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


  render: function() {

    var tags = []
    this.props.app.tags.forEach(function(tag){
        tags.push(
            <span className="tag">{tag}</span> 
        )
    });

    return (
      <div className="application">
        <p>{this._highlighted(this.props.app.name, this.props.highlightText)}</p>
        <p>{this._highlighted(this.props.app.description, this.props.highlightText)}</p>
        <p>{tags}</p>
      </div>
    );
  }
});

/**
 * Filterable list of Applications
 */
var FilterableList = React.createClass({
  
  getInitialState: function() {
    return {
      alreadyAdded: [],
      filter: ""
    };
  },

  onSearchFieldUpdate: function(field) {
      this.setState({
        filter: field.target.value
      })
  },

  render: function() {
    var displayed = []

    /*
     * Shortcut to push data
     */
    var _push = function(item, text) {
        displayed.push(
            <li>
              <Application highlightText={text} app={item} />
            </li>
        )
    };

    /*
     * Is current item matches to the text typed in searching field
     */
    var _isMatching = function(item, text) {
        text = text.toUpperCase();
        return (item.name.toUpperCase().indexOf(text) > -1) || (item.description.toUpperCase().indexOf(text) > -1);
    }

    // filter items
    for (var i = 0; i < this.props.data.length; i++) {
        if(!this.state.filter.trim()) {
          // no filter activated
          _push(this.props.data[i], "");
        }
        else if (_isMatching(this.props.data[i], this.state.filter)) {
          _push(this.props.data[i], this.state.filter);   
        }
    }

    return (
      <div>
        <input type="text" onKeyUp={this.onSearchFieldUpdate} />
        <ul>
          {displayed}
        </ul>
      </div>  
      )
  }
});

/**
 * Main method. Loads JSON and renders the list
 */
(function(){

  var req = new XMLHttpRequest();
  req.open('GET', 'applications.json');

  req.onload = function() {

    if (req.status !== 200) {
      throw new Error('nope');
    }

    ReactDOM.render(
          <FilterableList data={JSON.parse(req.response)} />
      ,
      document.getElementById("filterableList")
    );



  };

  req.send();
})()
