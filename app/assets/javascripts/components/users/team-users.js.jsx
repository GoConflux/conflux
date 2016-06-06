var TeamUsers = React.createClass({

  setAppSelectRef: function (ref) {
    this.appSelect = ref;
  },

  setTeamUsersListRef: function (ref) {
    this.teamUsersList = ref;
  },

  onChangeApps: function () {
    //var self = this;
    //var selectedSlug = $(this.appSelect).val();
    //var endpoint = (selectedSlug === this.allAppsSlug) ? '/apps/users' : '/teams/team_users';
    //var data = (selectedSlug === this.allAppsSlug) ? {} : { app_slug: selectedSlug };

    //React.get(endpoint, data, {
    //  success: function (users) {
    //    self.teamUsersList.setState({
    //      users: users
    //    });
    //  }
    //});
  },

  showAddMembersModal: function () {
    React.modal.show('users:invite', { team_uuid: this.props.team_uuid });
  },

  getSelectOptions: function () {
    var options = this.props.apps;

    this.allAppsSlug = (Math.random() * 10).toString().replace('.', '');

    options.unshift({ slug: this.allAppsSlug,  name: 'All apps' });

    return this.props.apps.map(function (app) {
      return <option value={app.slug}>{app.name}</option>;
    });
  },

  getHeader: function () {
    return this.props.team_name + ' Team';
  },

  render: function() {
    return (
      <div id="teamUsers">
        <div id="teamUsersHeader">
          <div className="team-users-header-left">
            <div className="left-header-title">{this.getHeader()}</div>
            <div className="header-linebreak"></div>
            <div className="add-members-btn" onClick={this.showAddMembersModal}><span className="text">Add Members</span>&nbsp;&nbsp;+</div>
          </div>
          <div className="team-users-header-right">
            <select className="conflux-select app-select" ref={this.setAppSelectRef} onChange={this.onChangeApps}>{this.getSelectOptions()}</select>
          </div>
        </div>
        <TeamUsersList users={this.props.users} ref={this.setTeamUsersListRef} />
      </div>
    );
  }
});