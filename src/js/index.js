var React = require('react');
var ReactDOM = require('react-dom');

/**
 * One single suggestion 
 **/
var Application = React.createClass({

  getInitialState: function() {
    return {
      isDescriptionShown: false,
    };
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
    var hTag = this.props.highlightedTag.substring(1);
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
            <p className={descriptionClass}>{this._highlighted(this.props.app.description, this.props.highlightText)}</p>
            <p>{tags}</p>
            <button onClick={this.onToggle}>[Show]</button>
            <button onClick={this.onClick}>[+ Add]</button>
          </div>
      );

    }
    else {

      // simple applications
      return (
          <div className="application" id={"app" + this.props.app.id}>
            <h1>{this.props.app.name}</h1>
            <p className={descriptionClass}>{this.props.app.description}</p>
            <p>{tags}</p>
            <button onClick={this.onToggle}>[Show]</button>
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
    var _push = function(item, text, idx, callback, tag) {
        displayed.push(
          <li>
              <Application key={"app" + idx} highlightText={text} highlightedTag={tag} app={item} onButtonClick={callback} isTextHighlighted={true}/>
          </li>
        );
    };

    /*
     * Is current item matches to the text typed in searching field
     */
    var _isMatching = function(item, text) {
        text = text.toUpperCase();
        return (item.name.toUpperCase().indexOf(text) > -1) || (item.description.toUpperCase().indexOf(text) > -1);
    }

    /*
     * Is current item tag matches the entered phrase
     */
    var _isTagMatching = function(item, text) {
        var isStartingWithHash = (text.substring(0, 1) === "#");
        if (isStartingWithHash) {
          var hasTagMatching = (item.tags.indexOf(text.substring(1).toLowerCase()) > -1);
          return isStartingWithHash && hasTagMatching;
        }
        else {
          return false;
        }
    }

    // filter items
    for (var i = 0; i < this.state.items.length; i++) {
        if(!this.state.filter.trim()) {
          // no filter activated
          _push(this.state.items[i], "", i, this.props.onAdd, "");
        }
        else if (_isTagMatching(this.state.items[i], this.state.filter)) {
          // filtered by tag
          _push(this.state.items[i], "", i, this.props.onAdd, this.state.filter);
        }
        else if (_isMatching(this.state.items[i], this.state.filter)) {
          // filtered by any phrase
          _push(this.state.items[i], this.state.filter, i, this.props.onAdd, "");   
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

var Modal = React.createClass({
  
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
          <p>&nbsp;</p>
        )
    }
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
      filter: null,
      modalIsOpen: false
    };
  },

  onGenerateScript: function(ent) {
    this.refs.modal.show(this.state.items);
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
        <Modal ref="modal" />
        <button onClick={this.onGenerateScript} disabled={this.state.items.length == 0}>Generate script</button>
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


