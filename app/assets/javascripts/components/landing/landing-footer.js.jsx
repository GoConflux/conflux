var LandingFooter = React.createClass({

  render: function() {
    return (
      <div id="landingFooter">
        <div className="footer-inner">
          <div className="footer-left footer-section">
            <a href="/"><img className="footer-icon" src="https://ds8ypexjwou5.cloudfront.net/images/conflux-icon-footer.svg" /></a>
          </div>
          <div className="footer-middle footer-section">
            <div className="made-with-love">Made with <i className="fa fa-heart"></i> by Conflux</div>
          </div>
          <div className="footer-right footer-section">
            <a href="mailto:team@goconflux.com" className="footer-action-link">Contact Us</a>
          </div>
        </div>
      </div>
    );
  }
});