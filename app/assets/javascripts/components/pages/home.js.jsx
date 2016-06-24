var Home = React.createClass({

  getInitialState: function () {
    return {
    };
  },

  render: function() {
    return (
      <div id="home">
        <div className="home-header">
          <div className="title">Conflux Add-ons Platform & Marketplace</div>
          <div className="subtitle">Manage all of your app's third-party services from one place, regardless of host platform or environment.</div>
        </div>
        <div id="homeBody"></div>
        <LandingFooter />
      </div>
    );
  }
});