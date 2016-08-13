var Header = React.createClass({

  configureBackBtn: function () {
    if (this.props.back_url) {
      return <a className="header-back-btn" onClick={this.onBackClick} href={this.props.back_url}><i className="fa fa-angle-left header-back-btn-icon"></i><div className="header-back-btn-text">{this.props.back_text}</div></a>;
    }
    return;
  },

  onBackClick: function () {
    if (this.props.use_window_history) {
      window.history.back();
    }
  },

  componentDidMount: function () {
    var myTeamsBtn = document.getElementById('lh-teams-button');

    if (myTeamsBtn) {
      myTeamsBtn.addEventListener('click', function (e) {
        $('#headerTeamMenu').toggle();
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }
  },

  render: function() {
    return (
      <div id="header">
        <div className="header-inner">
          {this.configureBackBtn()}
          <i className="fa fa-bars" id="headerMenuBtn"></i>
          <a href="/"><img src="https://ds8ypexjwou5.cloudfront.net/images/conflux-icon-dark.svg" className="conflux-icon"/></a>
          <div id="lh-teams-button" className="dark"><i className="fa fa-th-large teams-grid-icon"></i><div className="teams-text">My Teams</div></div>
          <div className="header-right header-right-text-btn"><a className="header-action-btn" href="/services">Services</a></div>
          <div className="header-right header-right-text-btn"><a className="header-action-btn" href="/download">Download</a></div>
        </div>
      </div>
    );
  }
});