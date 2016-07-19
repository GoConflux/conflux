var TeamUser = React.createClass({

  onEditUser: function () {
    var self = this;
    var selectedIndexOfRole = 1;  // Contributor

    if (this.props.data.is_admin) {
      selectedIndexOfRole = 2;  // Admin
    } else if (this.props.data.limited) {
      selectedIndexOfRole = 0;  // Contributor - Limited
    }

    React.modal.show('users:update', { email: this.props.data.email, selectedIndex: selectedIndexOfRole }, {
      onConfirm: function (data) {
        React.put('/team_users', _.extend(data, { team_user_uuid: self.props.data.team_user_uuid }), {
          success: function (resp) {
            self.props.updateUsersList(resp.users);
          }
        });
      }
    });
  },

  onRemoveUser: function () {
    var self = this;

    React.modal.show('users:delete', { email: this.props.data.email }, {
      onConfirm: function () {
        React.delete('/team_users', { team_user_uuid: self.props.data.team_user_uuid }, {
          success: function (resp) {
            self.props.updateUsersList(resp.users);
          }
        });
      }
    });
  },

  getAdminOrOwnerLabel: function () {
    var label = 'Contributor';

    if (this.props.data.is_owner) {
      label = 'Owner';
    } else if (this.props.data.is_admin) {
      label = 'Admin';
    } else if (this.props.data.limited) {
      label += ' (Limited)';
    }

    return label;
  },

  getUserPic: function () {
    var classes = this.props.data.pic ? '' : 'no-pic';
    var src = this.props.data.pic || 'https://ds8ypexjwou5.cloudfront.net/images/user.svg';
    return <img src={src} className={classes} />;
  },

  getUserName: function () {
    var email = this.props.data.email;
    var name = this.props.data.name;

    return name ? <span>{email}<span className="name">&nbsp;&nbsp;({name})</span></span> : email;
  },

  getActionIcons: function () {
    if (!this.props.cuCanEdit || this.props.data.is_owner) {
      return;
    }

    return <div className="team-user-action-icons"><i className="fa fa-pencil edit" onClick={this.onEditUser}></i><i className="fa fa-times remove" onClick={this.onRemoveUser}></i></div>
  },

  render: function() {
    return (
      <div className="team-user">
        <div className="team-user-pic">{this.getUserPic()}</div>
        <div className="team-user-name">{this.getUserName()}</div>
        {this.getActionIcons()}
        <div className="team-user-label">{this.getAdminOrOwnerLabel()}</div>
      </div>
    );
  }
});