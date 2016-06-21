var Home = React.createClass({

  getInitialState: function () {
    return {
    };
  },

  render: function() {
    return (
      <div id="home">
        <div className="home-header">
          <div className="title">Introducing Elements Marketplace</div>
          <div className="subtitle">Find everything you need for your app, your stack, and your workflow in one place.</div>
        </div>
        <div id="homeBody"></div>
        <LandingFooter />
      </div>
    );
  }
});