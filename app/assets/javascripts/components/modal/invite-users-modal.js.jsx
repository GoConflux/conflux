var InviteUsersModal = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  setInputContainerRef: function (ref) {
    this.inputContainer = ref;
  },

  validate: function () {
    if (!$(this.input).val().trim()) {
      $(this.inputContainer).addClass('invalid');
      return false;
    }

    return true;
  },

  onConfirm: function () {
    var emails = _.map($(this.input).val().split(','), function (email) {
      return email.trim();
    });

    React.post('/team_users/invite', {
        team_uuid: this.props.data.team_uuid,
        emails: emails
      },
      {
        success: function () {
          React.modal.hide();
        }
      }
    );
  },

  onKeyUp: function () {
    $(this.inputContainer).removeClass('invalid');
  },

  onHide: function () {
    $(this.input).val('');
  },

  render: function() {
    return (
      <div className="invite-users-modal">
        <div className="modal-name-input-container" ref={this.setInputContainerRef}>
          <input type="text" className="modal-name-input" placeholder="Emails (comma-delimited)" onKeyUp={this.onKeyUp} ref={this.setInputRef} />
        </div>
      </div>
    );
  }

});