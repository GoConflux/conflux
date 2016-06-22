var UpsertPipelineModal = React.createClass({

  setNameInputRef: function (ref) {
    this.nameInput = ref;
  },

  onNameInputKeyUp: function (name) {
    var self = this;
    var originalName = (this.props.data || {}).name;

    if (originalName && name === originalName) {
      this.nameInput.showValid();
      return;
    }

    var data = { name: name };

    if (this.props.data.pipelineUUID) {
      data.pipeline_uuid = this.props.data.pipelineUUID;
    }

    React.get('/pipelines/name_available', data, {
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