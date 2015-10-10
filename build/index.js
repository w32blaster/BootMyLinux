/**
 * One single suggestion 
 **/
"use strict";

var Application = React.createClass({
  displayName: "Application",

  getInitialState: function getInitialState() {
    return {
      selected: false
    };
  },

  isSelected: function isSelected() {
    return this.state.selected;
  },

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
    this.setState({
      selected: !this.state.selected
    });
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

    var className = "application";
    if (this.state.selected) {
      className += " selected";
    }

    return React.createElement(
      "div",
      { className: className, onClick: this.onClick },
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
      )
    );
  }
});

/**
 * Filterable list of Applications
 */
var FilterableList = React.createClass({
  displayName: "FilterableList",

  getInitialState: function getInitialState() {
    return {
      alreadyAdded: [],
      filter: ""
    };
  },

  pullSelectedApps: function pullSelectedApps() {
    var selectedApps = [];
    for (var i = 0; i < this.length; i++) {
      if (this.refs['app' + i].isSelected()) selectedApps.push(this.refs['app' + i]);
    }
    return selectedApps;
  },

  onSearchFieldUpdate: function onSearchFieldUpdate(field) {
    this.setState({
      filter: field.target.value
    });
  },

  length: 0,

  render: function render() {

    this.length = this.props.data.length;
    var displayed = [];

    /*
     * Shortcut to push data
     */
    var _push = function _push(item, text, idx) {
      displayed.push(React.createElement(
        "li",
        null,
        React.createElement(Application, { ref: 'app' + idx, highlightText: text, app: item })
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
    for (var i = 0; i < this.length; i++) {
      if (!this.state.filter.trim()) {
        // no filter activated
        _push(this.props.data[i], "", i);
      } else if (_isMatching(this.props.data[i], this.state.filter)) {
        _push(this.props.data[i], this.state.filter, i);
      }
    }

    return React.createElement(
      "div",
      null,
      React.createElement("input", { type: "text", onKeyUp: this.onSearchFieldUpdate }),
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

  onAdd: function onAdd() {
    var selectedApps = this.refs.filteredList.pullSelectedApps();
    alert("Wow! Selected count is " + selectedApps.length);
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
        React.createElement(FilterableList, { ref: "filteredList", data: this.props.data })
      ),
      React.createElement(
        "div",
        { className: "middle" },
        React.createElement(
          "button",
          { onClick: this.onAdd },
          " ⇒ "
        ),
        " ",
        React.createElement("br", null),
        React.createElement(
          "button",
          null,
          " ⇐ "
        ),
        " ",
        React.createElement("br", null),
        React.createElement(
          "button",
          null,
          " ⇚ "
        ),
        " ",
        React.createElement("br", null)
      ),
      React.createElement(
        "div",
        { className: "half" },
        React.createElement(
          "h1",
          null,
          "Added programs"
        ),
        React.createElement("div", { ref: "addedApplications" })
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