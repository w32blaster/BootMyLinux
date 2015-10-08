/**
 * One single suggestion 
 **/
"use strict";

var Application = React.createClass({
  displayName: "Application",

  getInitialState: function getInitialState() {
    return { data: [] };
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

    return React.createElement(
      "div",
      { className: "application" },
      React.createElement(
        "h1",
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

  onSearchFieldUpdate: function onSearchFieldUpdate(field) {
    this.setState({
      filter: field.target.value
    });
  },

  render: function render() {
    var displayed = [];

    var _push = function _push(item, text) {
      displayed.push(React.createElement(
        "li",
        null,
        React.createElement(Application, { highlightText: text, app: item })
      ));
    };

    var _isMatching = function _isMatching(item, text) {
      return item.name.indexOf(text) > -1 || item.description.indexOf(text) > -1;
    };

    // filter items
    for (var i = 0; i < this.props.data.length; i++) {
      if (!this.state.filter.trim()) {
        // no filter activated
        _push(this.props.data[i], "");
      } else if (_isMatching(this.props.data[i], this.state.filter)) {
        _push(this.props.data[i], this.state.filter);
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
 * Main method. Loads JSON and renders the list
 */
(function () {

  var req = new XMLHttpRequest();
  req.open('GET', 'applications.json');

  req.onload = function () {

    if (req.status !== 200) {
      throw new Error('nope');
    }

    ReactDOM.render(React.createElement(FilterableList, { data: JSON.parse(req.response) }), document.getElementById("filterableList"));
  };

  req.send();
})();