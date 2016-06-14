var ModalTitledInput = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  setInputContainerRef: function (ref) {
    this.inputContainer = ref;
  },

  getDefaultValue: function () {
    return this.props.defaultValue || '';
  },

  getValue: function () {
    return $(this.input).val().trim();
  },

  isValid: function () {
    return !!this.getValue();
  },

  showInvalid: function () {
    $(this.inputContainer).addClass('invalid');
  },

  validate: function () {
    var valid = this.isValid();

    if (!valid) {
      this.showInvalid();
    }

    return valid;
  },
  
  onKeyUp: function () {
    $(this.inputContainer).removeClass('invalid');
  },

  render: function() {
    return (
      <div className="modal-titled-input-container" ref={this.setInputContainerRef}>
        <div className="select-title">{this.props.titleText}</div>
        <input key={Date.now()} type="text" className="modal-titled-input" onKeyUp={this.onKeyUp} placeholder={this.props.placeholder} defaultValue={this.getDefaultValue()} ref={this.setInputRef} />
      </div>
    );
  }

});