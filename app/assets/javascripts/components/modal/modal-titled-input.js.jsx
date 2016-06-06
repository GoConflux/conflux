var ModalTitledInput = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  getDefaultValue: function () {
    return this.props.defaultValue || '';
  },

  getValue: function () {
    return $(this.input).val();
  },

  render: function() {
    return (
      <div className="modal-titled-input-container">
        <div className="select-title">{this.props.titleText}</div>
        <input key={Date.now()} type="text" className="modal-titled-input" placeholder={this.props.placeholder} defaultValue={this.getDefaultValue()} ref={this.setInputRef} />
      </div>
    );
  }

});