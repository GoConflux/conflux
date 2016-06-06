var InAppSearchBar = React.createClass({

  componentDidMount: function () {
    var self = this;

    try {
      $('.autocomplete-input').selectize({
        persist: false,
        openOnFocus: false,
        closeAfterSelect: true,
        multi: false,
        load: function (query, cb) {
          self.fetchResults(query, cb);
        },
        onType: function (str) {
          if (_.isEmpty(str)) {
            this.close();
          }
        },
        onItemAdd: function (value) {
          self.props.onAddonSelected(value);
          this.clear();
          this.blur();
        }
      });
    } catch (e) {}
  },

  fetchResults: function (query, cb) {
    React.get('/addons/search', { query: query }, {
      success: function (results) {
        cb(results);
      }
    });
  },

  render: function() {
    return (
      <div className="in-app-search-bar">
        <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/search.png" />
        <input type="text" className="autocomplete-input" placeholder="Find other add-ons to add"/>
      </div>
    );
  }
});