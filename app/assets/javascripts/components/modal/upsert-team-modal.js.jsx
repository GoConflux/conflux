var UpsertTeamModal = React.createClass({

  setNameInputRef: function (ref) {
    this.nameInput = ref;
  },

  onNameInputKeyUp: function (name) {
    var self = this;
    var originalName = this.props.data.defaultName;

    if (originalName && name === originalName) {
      this.nameInput.showValid();
      return;
    }

    var data = { name: name };

    if (this.props.data.teamUUID) {
      data.team_uuid = this.props.data.teamUUID;
    }

    React.get('/teams/name_available', data, {
      success: function (info) {
        info.available ? self.nameInput.showValid() : self.nameInput.showInvalid();
      }
    });
  },

  serialize: function () {
    return {
      name: this.nameInput.getValue()
    };
  },

  validate: function () {
    var nameExists = !!this.nameInput.getValue();

    if (!nameExists) {
      this.nameInput.showInvalid();
      return false;
    }

    if (!this.nameInput.isAvailable()) {
      return false;
    }

    return true;
  },

  render: function() {
    var self = this;

    return (
      <div className="create-team-modal">
        <ModalNameInput placeholder={'Team name'} defaultName={this.props.data.defaultName} onKeyUp={this.onNameInputKeyUp} ref={this.setNameInputRef} />
      </div>
    );
  }
});