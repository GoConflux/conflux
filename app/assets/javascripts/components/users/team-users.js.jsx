var TeamUsers = React.createClass({

  updateUsersList: function (users) {
    this.teamUsersList.setState({ users: users });
    React.modal.hide();
  },

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
    if (this.props.cu_can_invite) {
      return <div className="add-members-btn" onClick={this.showAddMembersModal}><span className="text">New Member</span>&nbsp;&nbsp;+</div>;
    }

    var text = this.props.users.length + ' member';

    if (this.props.users.length != 1) {
      text += 's';
    }

    return <div className="members-total">{text}</div>;
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
        <TeamUsersList users={this.props.users} cuCanEdit={this.props.cu_can_edit} updateUsersList={this.updateUsersList} ref={this.setTeamUsersListRef} />
      </div>
    );
  }
});