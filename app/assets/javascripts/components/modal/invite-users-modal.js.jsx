var InviteUsersModal = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  setInputContainerRef: function (ref) {
    this.inputContainer = ref;
  },

  onConfirm: function () {
    var val = $(this.input).val();

    if (!val.trim()) {
      $(this.inputContainer).addClass('invalid');
      return;
    }

    var emails = _.map(val.split(','), function (email) {
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