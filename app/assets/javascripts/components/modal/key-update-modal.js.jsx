var KeyUpdateModal = React.createClass({

  setKeyNameRef: function (ref) {
    this.keyNameInput = ref;
  },

  setKeyValueRef: function (ref) {
    this.keyValueInput = ref;
  },

  setDescriptionRef: function (ref) {
    this.description = ref;
  },

  validate: function () {
    var nameValid = this.keyNameInput.validate();
    var valueValid = this.keyValueInput.validate();

    return nameValid && valueValid;
  },

  serialize: function () {
    return {
      name: this.keyNameInput.getValue().trim(),
      value: this.keyValueInput.getValue().trim(),
      description: this.description.getValue().trim()
    };
  },

  render: function() {
    return (
      <div className="key-update-modal-body">
        <ModalTitledInput titleText={'Key'} defaultValue={this.props.data.name} ref={this.setKeyNameRef} />
        <ModalTitledInput titleText={'Value'} defaultValue={this.props.data.value} ref={this.setKeyValueRef} />
        <ModalTitledInput titleText={'Description'} defaultValue={this.props.data.description} ref={this.setDescriptionRef} />
      </div>
    );
  }
});