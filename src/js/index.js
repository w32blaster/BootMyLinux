import React from 'react';
import ReactDOM from 'react-dom';
import Application from './components/Application';

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


