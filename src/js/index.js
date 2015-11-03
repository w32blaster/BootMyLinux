var React = require('react');
var ReactDOM = require('react-dom');
var Autosuggest = require('react-autosuggest');
var Application = require('./components/Application.js');
var Modal = require('./components/Modal.js');

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

  onClear: function(ent) {
    this.onTagSelected("");
  },

  onTagSelected: function(value) {
    this.onSuggestionSelected(value, null);
    this.refs.autosuggest.state.value = value;
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
    var _push = function(item, text, idx, callback, callbackTagSelected, tag) {
        displayed.push(
          <li>
              <Application 
                    key={"app" + idx} 
                    highlightText={text} 
                    highlightedTag={tag} 
                    app={item} 
                    onButtonClick={callback} 
                    onTagSelected={callbackTagSelected}
                    isTextHighlighted={true}/>
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

    // filter application list
    for (var i = 0; i < this.state.items.length; i++) {
        if(!this.state.filter.trim()) {

          // no filter activated: nothing is highlighted
          _push(this.state.items[i], "", i, this.props.onAdd, this.onTagSelected, "");
        }
        else if (_isTagMatching(this.state.items[i], this.state.filter)) {
          
          // filtered by tag (tag is highlighted)
          _push(this.state.items[i], "", i, this.props.onAdd, this.onTagSelected, this.state.filter);
        }
        else if (_isMatching(this.state.items[i], this.state.filter)) {

          // filtered by any phrase (searched words are marked with bold text)
          _push(this.state.items[i], this.state.filter, i, this.props.onAdd, this.onTagSelected, "");   
        }
    }

    const inputAttributes = {
      id: 'search-field',
      placeholder: 'Enter search...'
    };

    return (
      <div>

        <Autosuggest
            ref="autosuggest"
            suggestions={this.getSuggestions} 
            onSuggestionSelected={this.onSuggestionSelected} 
            showWhen={this.isSuggestionShown}
            value={this.state.filter}
            inputAttributes={inputAttributes} />

            <button className="appDesriptionExpand clearBtn" onClick={this.onClear}>x</button>

            <div id="explanation">Type any sympol to search by title or start with <strong>#</strong> to search by tag.</div>

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
          <div className="content-container">
            <div className="sidebar">
              <div>
                <h1>Got fresh Linux installation?</h1>
                <h2>Need to install tons of new programms?</h2>
                <h3>Generate script and install useful apps with only one command.</h3>
              </div>
              <div>
                <h1>Your selection</h1>
                <AddedList ref="addedList" onRemove={this.onRemove} />
              </div>
              <footer>
                <p>by <span itemprop="copyrightHolder">W32blaster</span>, <span itemprop="copyrightYear">2015</span></p>
              </footer>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <h1>Available applications</h1>
                  <FilterableList ref="filteredList" data={this.props.data} tags={this.props.tags} onAdd={this.onAdd} />
                </div>
              </div>
            </div>
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


