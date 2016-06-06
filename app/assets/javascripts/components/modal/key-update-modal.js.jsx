var KeyUpdateModal = React.createClass({

  hideOnConfirm: true,

  setKeyNameRef: function (ref) {
    this.keyNameInput = ref;
  },

  setKeyValueRef: function (ref) {
    this.keyValueInput = ref;
  },

  serialize: function () {
    return {
      name: this.keyNameInput.getValue(),
      value: this.keyValueInput.getValue()
    };
  },

  render: function() {
    return (
      <div className="key-update-modal-body">
        <ModalTitledInput titleText={'Key'} defaultValue={this.props.data.name} ref={this.setKeyNameRef} />
        <ModalTitledInput titleText={'Value'} defaultValue={this.props.data.value} ref={this.setKeyValueRef} />
      </div>
    );
  }
});