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
        <div className="application">
          <p>{this._highlighted(this.props.app.name, this.props.highlightText)}</p>
          <p>{this._highlighted(this.props.app.description, this.props.highlightText)}</p>
          <p>{tags}</p>
          <button onClick={this.onClick}>[+ Add]</button>
        </div>
      );

    } else {

      return (
        <div className="application">
          <p>{this.props.app.name}</p>
          <p>{this.props.app.description}</p>
          <p>{tags}</p>
          <button onClick={this.onClick}>[- Remove]</button>
        </div>
      );

    }

  }
});

/**
 * Set of common functions to push and pull items from lists
 */
var PullPushMixin = {

   pull: function(item) {
      var idx = this.state.items.indexOf(item);
      var deletedItem = this.state.items.splice( idx, 1 )[0];
      
      this.setState({
        items: this.state.items,
        filter: ""
      });

      return deletedItem;
   },

   push: function(item) {

      this.state.items.push(item);
      this.setState({
        items: this.state.items,
        filter: ""
      });

   }

}

/**
 * Filterable list of Applications
 */
var FilterableList = React.createClass({

  mixins: [PullPushMixin],
  
  getInitialState: function() {
    return {
      items: this.props.data,
      filter: ""
    };
  },

  onSearchFieldUpdate: function(field) {
      this.setState({
        filter: field.target.value
      })
  },

  render: function() {

    var displayed = [];

    /*
     * Shortcut to push data
     */
    var _push = function(item, text, idx, callback) {
        displayed.push(
          <li>
            <Application highlightText={text} app={item} onButtonClick={callback} isTextHighlighted={true}/>
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
    for (var i = 0; i < this.state.items.length; i++) {
        if(!this.state.filter.trim()) {
          // no filter activated
          _push(this.state.items[i], "", i, this.props.onAdd);
        }
        else if (_isMatching(this.state.items[i], this.state.filter)) {
          // filtered by searched phrase
          _push(this.state.items[i], this.state.filter, i, this.props.onAdd);   
        }
    }

    return (
      <div>
        <input id="search-field" type="text" onKeyUp={this.onSearchFieldUpdate} />
        <ul>
          {displayed}
        </ul>
      </div>  
    )
  }
});


/**
 * List of selected (added) Applications.
 */
var AddedList = React.createClass({

  mixins: [PullPushMixin],
  
  getInitialState: function() {
    return {
      items: [],
      filter: null
    };
  },

  render: function() {
 
    var displayed = [];

    for(var i=0; i<this.state.items.length; i++) {
      displayed.push(
          <li>
            <Application app={this.state.items[i]} onButtonClick={this.props.onRemove} isTextHighlighted={false} />
          </li>
        )
    }

    return (
      <div>
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

  onAdd: function(item) {
      var appToAdd = this.refs.filteredList.pull(item);
      this.refs.addedList.push(appToAdd);
  },

  onRemove: function(item) {
      var appToRemove = this.refs.addedList.pull(item);
      this.refs.filteredList.push(appToRemove);
  },

  render: function() {
    return (
        <div>

          <div className="half">
              <h1>Available programs</h1>
              <FilterableList ref="filteredList" data={this.props.data} onAdd={this.onAdd} />
          </div>

          <div className="half">
              <h1>Added programs</h1>
              <AddedList ref="addedList" onRemove={this.onRemove} />
          </div>

          <div className="clear" />

        </div>
      )
  }

});

/**
 * Main method. Loads JSON and renders the list
 */
(function() {

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
