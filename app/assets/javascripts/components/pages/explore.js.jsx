var Explore = React.createClass({
  
  setCategoryAddonsRef: function (ref) {
    this.categoryAddons = ref;
  },

  getCategoryNames: function () {
    var self = this;

    return (this.props.addons || []).map(function (group) {
      return <div className="category-name" onClick={self.scrollToCategory} data-category={group[0].toLowerCase()}>{group[0]}</div>;
    });
  },

  scrollToCategory: function (e) {
    var category = $(e.target).attr('data-category');
    var topOfSelectedCategory = $('#addons > .category[data-category="' + category + '"]').offset().top;
    $('html, body').animate({ scrollTop: topOfSelectedCategory - 26 }, 500);
  },

  render: function() {
    return (
      <div id="explore">
        <div className="home-header"></div>
        <div className="explore-subheader conflux-container">
          <div className="title">Add-ons are the tools and services for developing, extending, and operating your app.</div>
          <div className="subtitle">Use technologies you love with over 150 Add-ons from the Elements Marketplace. Add-ons are fully-managed services, integrated for use with Heroku. They can be provisioned and scaled in one command. Add-ons provide services for logging, caching, monitoring, persistence and more.</div>
        </div>
        <div className="explore-body conflux-container">
          <div id="categoriesList">
            <div className="header">Categories</div>
            <div className="items">{this.getCategoryNames()}</div>
          </div>
          <CategoryAddons data={this.props} ref={this.setCategoryAddonsRef} />
        </div>
        <LandingFooter />
      </div>
    );
  }
});