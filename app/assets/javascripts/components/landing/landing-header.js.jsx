var LandingHeader = React.createClass({

  logoSwitchWidth: 499,

  longLogo: 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/conflux-long-white-colored-icon.svg',

  loginLogo: 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/conflux-long-colored.svg',

  iconLogo: 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/conflux-icon-colored.svg',

  setLogoRef: function (ref) {
    this.logo = ref;
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

    this.addWindowResizeEvent();

    var image = (window.innerWidth > this.logoSwitchWidth) ? this.properLongLogo() : this.iconLogo;
    $(this.logo).attr('src', image);
  },

  addWindowResizeEvent: function () {
    var self = this;

    $(window).resize(function () {
      if (window.innerWidth > self.logoSwitchWidth && $(self.logo).attr('src') != self.properLongLogo()) {
        $(self.logo).attr('src', self.properLongLogo());
      } else if (window.innerWidth <= self.logoSwitchWidth && $(self.logo).attr('src') != self.iconLogo) {
        $(self.logo).attr('src', self.iconLogo);
      }
    });
  },

  properLongLogo: function () {
    return (!!this.props.home || !!this.props.explore || !!this.props.toolbelt) ? this.longLogo : this.loginLogo;
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
    } else if (!!this.props.toolbelt) {
      return 'toolbelt';
    }
  },

  getExploreClasses: function () {
    var classes = 'lh-right-link';

    if (!!this.props.explore) {
      classes += ' selected';
    }

    return classes;
  },

  getToolbeltClasses: function () {
    var classes = 'lh-right-link';

    if (!!this.props.toolbelt) {
      classes += ' selected';
    }

    return classes;
  },

  render: function() {
    return (
      <div id="landingHeader" className={this.landingHeaderClass()}>
        <div className="lh-left">
          <a href="/"><img className="lh-logo" src={this.iconLogo} ref={this.setLogoRef}/></a>
        </div>
        <div className="lh-right">
          {this.getRightestButton()}
          <div className="lh-right-button">
            <a className={this.getExploreClasses()} href="/explore">Explore</a>
          </div>
          <div className="lh-right-button">
            <a className={this.getToolbeltClasses()} href="/toolbelt">Toolbelt</a>
          </div>
        </div>
      </div>
    );
  }
});