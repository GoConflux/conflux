var LandingHeader = React.createClass({

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

  // Either return a "Sign In" button or a button with all your teams
  getRightestButton: function () {
    var button;

    if (!!this.props.authed) {
      button = <div id="lh-teams-button"><i className="fa fa-th-large teams-grid-icon"></i><div className="teams-text">My Teams</div></div>;
    } else {
      button = <div className="lh-right-button"><a className="lh-right-link" href="/login">Sign In</a></div>;
    }

    return button;
  },

  landingHeaderClass: function () {
    if (!!this.props.home) {
      return 'home';
    } else if (!!this.props.explore) {
      return 'explore';
    } else {
      return '';
    }
  },

  confluxLogo: function () {
    return (!!this.props.home || !!this.props.explore) ?
      'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/conflux-long-white-colored-icon.svg' :
      'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/conflux-long-colored.svg';
  },

  getExploreClasses: function () {
    var classes = 'lh-right-link';

    if (!!this.props.explore) {
      classes += ' selected';
    }

    return classes;
  },

  render: function() {
    return (
      <div id="landingHeader" className={this.landingHeaderClass()}>
        <div className="lh-left">
          <a href="/"><img className="lh-logo" src={this.confluxLogo()}/></a>
        </div>
        <div className="lh-right">
          {this.getRightestButton()}
          <div className="lh-right-button">
            <a className={this.getExploreClasses()} href="/explore">Explore</a>
          </div>
        </div>
      </div>
    );
  }
});