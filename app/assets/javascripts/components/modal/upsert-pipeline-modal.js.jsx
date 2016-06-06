var UpsertPipelineModal = React.createClass({

  hideOnConfirm: true,

  setNameInputRef: function (ref) {
    this.nameInput = ref;
  },

  onNameInputKeyUp: function (name) {
    var self = this;

    React.get('/pipelines/name_available', { name: name }, {
      success: function (info) {
        info.available ? self.nameInput.showValid() : self.nameInput.showInvalid();
      }
    });
  },

  serialize: function () {
    return {
      name: this.nameInput.getValue(),
      description: $('.modal-add-description').val()
    };
  },

  isValid: function () {
    var self = this;

  },

  // Only used for Pipeline "Creation". Not updating
  onConfirm: function () {
    if (this.props.isNew) {
      var creationData = _.extend(this.serialize(), {
        team_uuid: this.props.data.team_uuid
      });

      React.post('/pipelines', creationData, {
        success: function (data) {
          window.location = data.url;
        }
      });
    }
  },

  render: function() {
    return (
      <div className="create-pipeline-modal-body">
        <ModalNameInput key={Date.now()} placeholder={'Name'} defaultName={(this.props.data || {}).name} onKeyUp={this.onNameInputKeyUp} ref={this.setNameInputRef} />
        <textarea key={Date.now() + 1} className="modal-add-description" defaultValue={(this.props.data || {}).description} placeholder="Description (optional)"></textarea>
      </div>
    );
  }
});