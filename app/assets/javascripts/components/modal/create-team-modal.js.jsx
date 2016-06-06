var CreateTeamModal = React.createClass({

  hideOnConfirm: true,

  setNameInputRef: function (ref) {
    this.nameInput = ref;
  },

  onNameInputKeyUp: function (name) {
    var self = this;

    React.get('/teams/name_available', { name: name }, {
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

  render: function() {
    var self = this;

    return (
      <div className="create-team-modal">
        <ModalNameInput placeholder={'Team name'} onKeyUp={this.onNameInputKeyUp} ref={this.setNameInputRef} />
      </div>
    );
  }
});