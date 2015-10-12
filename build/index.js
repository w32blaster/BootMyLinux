/**
 * One single suggestion 
 **/
"use strict";

var Application = React.createClass({
  displayName: "Application",

  _indexOfCaseInsensitive: function _indexOfCaseInsensitive(value, text) {
    return value.toUpperCase().indexOf(text.toUpperCase());
  },

  _highlighted: function _highlighted(value, text) {
    var startIdx = this._indexOfCaseInsensitive(value, text);
    if (!text.trim() || startIdx === -1) {
      return value;
    } else {
      var endIdx = startIdx + text.length;
      return [value.substring(0, startIdx), React.createElement(
        "b",
        null,
        text
      ), value.substring(endIdx)];
    }
  },

  onClick: function onClick(evt) {
    this.props.onButtonClick(this.props.app);
  },

  render: function render() {

    var tags = [];
    this.props.app.tags.forEach(function (tag) {
      tags.push(React.createElement(
        "span",
        { className: "tag" },
        tag
      ));
    });

    if (this.props.isTextHighlighted) {

      return React.createElement(
        "div",
        { className: "application" },
        React.createElement(
          "p",
          null,
          this._highlighted(this.props.app.name, this.props.highlightText)
        ),
        React.createElement(
          "p",
          null,
          this._highlighted(this.props.app.description, this.props.highlightText)
        ),
        React.createElement(
          "p",
          null,
          tags
        ),
        React.createElement(
          "button",
          { onClick: this.onClick },
          "[+ Add]"
        )
      );
    } else {

      return React.createElement(
        "div",
        { className: "application" },
        React.createElement(
          "p",
          null,
          this.props.app.name
        ),
        React.createElement(
          "p",
          null,
          this.props.app.description
        ),
        React.createElement(
          "p",
          null,
          tags
        ),
        React.createElement(
          "button",
          { onClick: this.onClick },
          "[- Remove]"
        )
      );
    }
  }
});

/**
 * Set of common functions to push and pull items from lists
 */
var PullPushMixin = {

  pull: function pull(item) {
    var idx = this.state.items.indexOf(item);
    var deletedItem = this.state.items.splice(idx, 1)[0];

    this.setState({
      items: this.state.items,
      filter: ""
    });

    return deletedItem;
  },

  push: function push(item) {

    this.state.items.push(item);
    this.setState({
      items: this.state.items,
      filter: ""
    });
  }

};

/**
 * Filterable list of Applications
 */
var FilterableList = React.createClass({
  displayName: "FilterableList",

  mixins: [PullPushMixin],

  getInitialState: function getInitialState() {
    return {
      items: this.props.data,
      filter: ""
    };
  },

  onSearchFieldUpdate: function onSearchFieldUpdate(field) {
    this.setState({
      filter: field.target.value
    });
  },

  render: function render() {

    var displayed = [];

    /*
     * Shortcut to push data
     */
    var _push = function _push(item, text, idx, callback) {
      displayed.push(React.createElement(
        "li",
        null,
        React.createElement(Application, { highlightText: text, app: item, onButtonClick: callback, isTextHighlighted: true })
      ));
    };

    /*
     * Is current item matches to the text typed in searching field
     */
    var _isMatching = function _isMatching(item, text) {
      text = text.toUpperCase();
      return item.name.toUpperCase().indexOf(text) > -1 || item.description.toUpperCase().indexOf(text) > -1;
    };

    // filter items
    for (var i = 0; i < this.state.items.length; i++) {
      if (!this.state.filter.trim()) {
        // no filter activated
        _push(this.state.items[i], "", i, this.props.onAdd);
      } else if (_isMatching(this.state.items[i], this.state.filter)) {
        // filtered by searched phrase
        _push(this.state.items[i], this.state.filter, i, this.props.onAdd);
      }
    }

    return React.createElement(
      "div",
      null,
      React.createElement("input", { id: "search-field", type: "text", onKeyUp: this.onSearchFieldUpdate }),
      React.createElement(
        "ul",
        null,
        displayed
      )
    );
  }
});

/**
 * List of selected (added) Applications.
 */
var AddedList = React.createClass({
  displayName: "AddedList",

  mixins: [PullPushMixin],

  getInitialState: function getInitialState() {
    return {
      items: [],
      filter: null
    };
  },

  render: function render() {

    var displayed = [];

    for (var i = 0; i < this.state.items.length; i++) {
      displayed.push(React.createElement(
        "li",
        null,
        React.createElement(Application, { app: this.state.items[i], onButtonClick: this.props.onRemove, isTextHighlighted: false })
      ));
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "ul",
        null,
        displayed
      )
    );
  }
});

/**
 * Wrapper, that contains all the elements
 */
var Wrapper = React.createClass({
  displayName: "Wrapper",

  onAdd: function onAdd(item) {
    var appToAdd = this.refs.filteredList.pull(item);
    this.refs.addedList.push(appToAdd);
  },

  onRemove: function onRemove(item) {
    var appToRemove = this.refs.addedList.pull(item);
    this.refs.filteredList.push(appToRemove);
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "half" },
        React.createElement(
          "h1",
          null,
          "Available programs"
        ),
        React.createElement(FilterableList, { ref: "filteredList", data: this.props.data, onAdd: this.onAdd })
      ),
      React.createElement(
        "div",
        { className: "half" },
        React.createElement(
          "h1",
          null,
          "Added programs"
        ),
        React.createElement(AddedList, { ref: "addedList", onRemove: this.onRemove })
      ),
      React.createElement("div", { className: "clear" })
    );
  }

});

/**
 * Main method. Loads JSON and renders the list
 */
(function () {

  var req = new XMLHttpRequest();
  req.open('GET', 'applications.json');

  req.onload = function () {

    if (req.status !== 200) {
      throw new Error('nope');
    }

    ReactDOM.render(React.createElement(Wrapper, { data: JSON.parse(req.response) }), document.getElementById("wrapper"));
  };

  req.send();
})();