var InAppSearchBar = React.createClass({

  setSearchBarRef: function (ref) {
    this.searchBar = ref;
  },

  setSearchBarWidth: function () {
    var siblingsWidth = 0;

    _.each($(this.searchBar).siblings(), function (sibling) {
      siblingsWidth += $(sibling).outerWidth();
    });

    var parentWidth = $(this.searchBar).parent().width();
    var width = 0.95 * (parentWidth - siblingsWidth - 32);

    $(this.searchBar).width(width);
  },

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
        },
        render: {
          option: function(item) {
            return '<div class="addon-search-result" data-value="' + item.value + '">' +
              '<img class="sr-icon" src="' + item.icon + '" />' +
              '<span class="sr-name">' + item.text + '</span>' +
              '</div>';
          }
        }
      });

      this.setSearchBarWidth();

      $(window).resize(function () {
        self.setSearchBarWidth();
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
      <div className="in-app-search-bar" ref={this.setSearchBarRef}>
        <img className="search-icon" src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/search.png" />
        <input type="text" className="autocomplete-input" placeholder="Find add-ons to add"/>
      </div>
    );
  }
});