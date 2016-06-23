var HeaderTeamMenu = React.createClass({

  signOut: function () {
    window.location = '/signout';
  },

  promptNewTeam: function () {
    React.modal.show('team:create', {}, {
      onConfirm: this.createNewTeam
    });
  },

  createNewTeam: function (data) {
    React.post('/teams', data, {
      success: function (resp) {
        window.location = resp.url;
      }
    });
  },

  setHeaderMenuRef: function (ref) {
    this.menu = ref;
  },

  componentDidMount: function () {
    var self = this;

    document.addEventListener('click', function () {
      $(self.menu).hide();
    });
  },

  getTeamIcon: function (team) {
    var el;

    if (team.icon) {
      el = <div className="team-icon" style={{ backgroundImage: "url('" + team.icon + "')" }}></div>;
    } else {
      el = <div className="team-icon no-icon">{team.name[0].toUpperCase()}</div>
    }

    return el;
  },

  getMenuItems: function () {
    var self = this;

    var items = (this.props.teams || []).map(function (team) {
      return <a className="header-team-menu-item-link" href={team.url}><li className="header-team-menu-item">{self.getTeamIcon(team)}<div className="header-team-name">{team.name}</div></li></a>;
    });

    if (items.length === 0) {
      items.push(<li className="header-team-menu-no-teams">No teams yet.<br/>You should create one!</li>)
    }

    items.push(<li className="header-team-menu-divider"></li>);
    items.push(<a className="header-team-menu-item-link non-team" onClick={this.promptNewTeam} href="javascript:void(0)"><li className="header-team-menu-item"><div className="team-icon">+</div><div className="header-team-name">Create new team</div></li></a>);
    items.push(<li className="header-team-menu-divider"></li>);
    items.push(<a className="header-team-menu-item-link non-team" onClick={this.signOut} href="javascript:void(0)"><li className="header-team-menu-item"><div className="team-icon"><i className="fa fa-sign-out"></i></div><div className="header-team-name">Sign out</div></li></a>);

    return items;
  },

  getMenuClasses: function () {
    return this.props.inside_app ? 'smaller-header' : ''
  },

  render: function() {
    return (
      <div id="headerTeamMenu" className={this.getMenuClasses()} ref={this.setHeaderMenuRef}>
        <div id="menuItemsScrollContainer">
          <ul id="headerTeamMenuList">{this.getMenuItems()}</ul>
        </div>
      </div>
    );
  }

});