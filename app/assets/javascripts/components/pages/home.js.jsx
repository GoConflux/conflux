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
          <div className="subtitle">Manage all of your app's third-party services from one secure location, regardless of host platform or environment.</div>
        </div>
        <div id="homeBody">
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <img className="image-section left" src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/platform-agnostic.png" />
              </div>
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Use add-ons across any platform.</div>
                  <div className="sub-text">This is my subtext.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-section">
            <div className="section-inner">
              <div className="sub-section">
                <div className="text-section">
                  <div className="feature">Easily clone & scale add-ons across environments.</div>
                  <div className="sub-text">This is my subtext.</div>
                </div>
              </div>
              <div className="sub-section">
                <img className="image-section right" src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/clone.png" />
              </div>
            </div>
          </div>

        </div>
        <LandingFooter />
      </div>
    );
  }
});