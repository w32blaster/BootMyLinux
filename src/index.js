/**
 * One single suggestion 
 **/
var Application = React.createClass({

  getInitialState: function() {
    return {data: []};
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
        <h1>{this.props.app.name}</h1>
        <p>{this.props.app.description}</p>
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

    var _push = function(item, text) {
        displayed.push(
            <li>
              <Application highlightText={text} app={item} />
            </li>
        )
    };

    var _isMatching = function(item, text) {
        return (item.name.indexOf(text) > -1) || (item.description.indexOf(text) > -1);
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
