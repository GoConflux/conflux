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
    } else if (!!this.props.toolbelt) {
      return 'toolbelt';
    } else if (!!this.props.service) {
      return 'service';
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
          <a href="/"><img className="lh-logo"/></a>
        </div>
        <div className="lh-right">
          {this.getRightestButton()}
          <div className="lh-right-button">
            <a className={this.getExploreClasses()} href="/services">Services</a>
          </div>
          <div className="lh-right-button">
            <a className={this.getToolbeltClasses()} href="/download">Download</a>
          </div>
        </div>
      </div>
    );
  }
});