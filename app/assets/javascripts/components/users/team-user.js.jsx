var TeamUser = React.createClass({

  getAdminOrOwnerLabel: function () {
    var label;

    if (this.props.data.is_owner) {
      label = 'Owner';
    } else if (this.props.data.is_admin) {
      label = 'Admin';
    }

    return label;
  },

  getUserPic: function () {
    // create some type of default user pic
    return this.props.data.pic || '';
  },

  getUserName: function () {
    var email = this.props.data.email;
    var name = this.props.data.name;

    return name ? <span>{email}<span className="name">&nbsp;&nbsp;({name})</span></span> : email;
  },

  render: function() {
    return (
      <div className="team-user">
        <img src={this.getUserPic()} className="team-user-pic" />
        <div className="team-user-name">{this.getUserName()}</div>
        <div className="team-user-label">{this.getAdminOrOwnerLabel()}</div>
      </div>
    );
  }
});