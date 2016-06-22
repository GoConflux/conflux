var DeleteTeamUserModal = React.createClass({

  render: function() {
    return (
      <div className="delete-team-user-modal-container">
        <div className="delete-team-user-modal-question">Are you sure you want to remove <span className="email-to-remove">{this.props.data.email}</span> as a team member?</div>
      </div>
    );
  }
});