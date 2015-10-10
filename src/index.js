/**
 * One single suggestion 
 **/
var Application = React.createClass({

  getInitialState: function() {
      return {
        selected: false
      };
  },

  isSelected: function() {
      return this.state.selected;
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

  onClick: function(evt) {
    this.setState({
        selected: !this.state.selected
    })
  },

  render: function() {

    var tags = []
    this.props.app.tags.forEach(function(tag){
        tags.push(
            <span className="tag">{tag}</span> 
        )
    });

    var className = "application";
    if (this.state.selected) {
      className += " selected";
    }

    return (
      <div className={className} onClick={this.onClick}>
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

  pullSelectedApps: function() {
     var selectedApps = [];
     for (var i = 0; i < this.length; i++) {
        if (this.refs['app' + i].isSelected())
          selectedApps.push(this.refs['app' + i]);
     } 
     return selectedApps;
  },

  onSearchFieldUpdate: function(field) {
      this.setState({
        filter: field.target.value
      })
  },

  length: 0,

  render: function() {
    
    this.length = this.props.data.length;
    var displayed = [];

    /*
     * Shortcut to push data
     */
    var _push = function(item, text, idx) {
        displayed.push(
            <li>
              <Application ref={'app' + idx} highlightText={text} app={item} />
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
    for (var i = 0; i < this.length; i++) {
        if(!this.state.filter.trim()) {
          // no filter activated
          _push(this.props.data[i], "", i);
        }
        else if (_isMatching(this.props.data[i], this.state.filter)) {
          _push(this.props.data[i], this.state.filter, i);   
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
 * Wrapper, that contains all the elements
 */
var Wrapper = React.createClass({

  onAdd: function() {
      var selectedApps = this.refs.filteredList.pullSelectedApps();
      alert("Wow! Selected count is " + selectedApps.length);
  },

  render: function() {
    return (
        <div>
          <div className="half">
              <h1>Available programs</h1>
              <FilterableList ref="filteredList" data={this.props.data} />
          </div>

          <div className="middle">
              <button onClick={this.onAdd}> ⇒ </button> <br />
              <button> ⇐ </button> <br />
              <button> ⇚ </button> <br />
          </div>

          <div className="half">
              <h1>Added programs</h1>
              <div ref="addedApplications" ></div>
          </div>

          <div className="clear" />

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
      <Wrapper data={JSON.parse(req.response)} />,
      document.getElementById("wrapper")
    );
  };

  req.send();
})()
