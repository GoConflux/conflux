var TeamUser = React.createClass({

  getAdminOrOwnerLabel: function () {
    var label;

    if (this.props.data.is_owner) {
      label = 'Owner';
    } else if (this.props.data.is_admin) {
      label = 'Admin';
    } else if (this.props.data.limited) {
      label = 'Limited';
    }

    return label;
  },

  getUserPic: function () {
    var classes = this.props.data.pic ? '' : 'no-pic';
    var src = this.props.data.pic || 'http://confluxapp.s3-website-us-west-1.amazonaws.com/images/user.svg';
    return <img src={src} className={classes} />;
  },

  getUserName: function () {
    var email = this.props.data.email;
    var name = this.props.data.name;

    return name ? <span>{email}<span className="name">&nbsp;&nbsp;({name})</span></span> : email;
  },

  getActionIcons: function () {
    // if current user can't edit users, just return
    if (!this.props.cuCanEdit) {
      return;
    }

    return <div className="team-user-action-icons"><i className="fa fa-pencil edit"></i><i className="fa fa-times remove"></i></div>
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