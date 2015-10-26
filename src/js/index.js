var React = require('react');
var ReactDOM = require('react-dom');
var Autosuggest = require('react-autosuggest');

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
      tags: this.props.tags,
      items: this.props.data,
      filter: ""
    };
  },

  onSearchFieldUpdate: function(field) {
      this.setState({
        filter: field.target.value
      })
  },

  
  getSuggestions: function(input, callback) {
      var suggestions = []
      if(input[0] === '#') {
        const regex = new RegExp('^' + input, 'i');
        suggestions = this.state.tags.filter(suburb => regex.test(suburb));
        var i = 0;
      }
      else {
        this.setState({
          filter: input
        })
      }
    
      callback(null, suggestions);
  },

  isSuggestionShown: function(input) {
     if (input.length == 0) {
        this.setState({
          filter: ""
        })
        return false;
     }
     else 
        return true;
  },

  onSuggestionSelected: function(input, event) {
    this.setState({
        filter: input
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
        var isStartingWithHash = (text[0] === "#");
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
        <Autosuggest id="search-field" suggestions={this.getSuggestions} onSuggestionSelected={this.onSuggestionSelected} showWhen={this.isSuggestionShown} />
        <div className="scrollable">
          <ul>
            {displayed}
          </ul>
        </div>
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
          <div id="modal-holder">&nbsp;</div>
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
        <button id="generate-btn" onClick={this.onGenerateScript} disabled={this.state.items.length == 0}>Generate script</button>
        <div className="scrollable">
          <ul>
            {displayed}
          </ul>
        </div>
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

          <div className="half left">
              <h1>Available programs</h1>
              <FilterableList ref="filteredList" data={this.props.data} tags={this.props.tags} onAdd={this.onAdd} />
          </div>

          <div className="half right">
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

    var json = JSON.parse(req.response);

    // collect unique tags
    var usedTags = [];
    for(var key in json) {
      var tags = json[key].tags
      if(tags) {
        for (var i in tags) {
          if (usedTags.indexOf(tags[i]) == -1) {
              usedTags.push("#" + tags[i].toLowerCase());
          }
        }
      }
    }

    ReactDOM.render(
      <Wrapper data={json} tags={usedTags}/>,
      document.getElementById("wrapper")
    );    

  };

  req.send();
})()


