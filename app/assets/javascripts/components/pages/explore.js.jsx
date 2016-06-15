var Explore = React.createClass({

  setGridRef: function (ref) {
    this.addonGrid = ref;
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
          <div className="addons">
            <AddonGrid data={this.props} ref={this.setGridRef} />
          </div>
        </div>
      </div>
    );
  }
});