var TeamUsers = React.createClass({

  setTeamUsersListRef: function (ref) {
    this.teamUsersList = ref;
  },

  showAddMembersModal: function () {
    var self = this;

    React.modal.show('users:invite', { team_uuid: this.props.team_uuid }, {
      onConfirm: function (data) {
        React.post('/team_users/invite', data, {
          success: function (resp) {
            self.teamUsersList.setState({ users: resp.users });
            React.modal.hide();
          }
        });
      }
    });
  },

  getHeader: function () {
    return this.props.team_name + ' Team';
  },

  getAddMembersBtn: function () {
    return this.props.cu_can_invite ?
      <div className="add-members-btn" onClick={this.showAddMembersModal}><span className="text">New Member</span>&nbsp;&nbsp;+</div> :
      <div className="members-total">{this.props.users.length + ' members'}</div>;
  },

  render: function() {
    return (
      <div id="teamUsers">
        <div id="teamUsersHeader">
          <div className="team-users-header-left">
            <div className="left-header-title">{this.getHeader()}</div>
            <div className="header-linebreak"></div>
            {this.getAddMembersBtn()}
          </div>
        </div>
        <TeamUsersList users={this.props.users} cuCanEdit={this.props.cu_can_edit} ref={this.setTeamUsersListRef} />
      </div>
    );
  }
});