var Explore = React.createClass({
  
  setScrollTopBtnRef: function (ref) {
    this.scrollTopBtn = ref;
    
    this.scrollTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      $('html, body').animate({ scrollTop: 0 }, 600);
      
      return false;
    });
  },
  
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

  showSuggestAnAddon: function () {
    React.modal.show('addon:suggest');
  },

  render: function() {
    return (
      <div id="explore">
        <div className="home-header"></div>
        <div className="explore-subheader conflux-container">
          <div className="title">Explore the Add-ons ready to integrate with your app.</div>
          <div className="subtitle">Add-ons are self-hosted, third-party services, ready to be integrated with your app in one command. They provide services for caching, persistence, email, messaging, and more.</div>
        </div>
        <div className="explore-body conflux-container">
          <div id="categoriesList">
            <div className="header">Categories</div>
            <div className="items">{this.getCategoryNames()}</div>
          </div>
          <CategoryAddons data={this.props} ref={this.setCategoryAddonsRef} />
        </div>
        <div onClick={this.showSuggestAnAddon} className="sub-footer-action-section">
          <i className="fa fa-arrow-up scroll-top-btn" ref={this.setScrollTopBtnRef}></i>
          <div className="sub-footer-action-section-inner">
            <div className="sub-footer-action-text-container">Have an Add-on suggestion? <span className="sub-footer-action-text">Let us know!</span></div>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }
});