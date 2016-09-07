var FormInput = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  serialize: function () {
    var valid = true;
    var value = $(this.input).val().trim();

    if (this.props.required && _.isEmpty(value)) {
      valid = false;
      this.showInvalid();
    }

    return { valid: valid, value: value };
  },

  showInvalid: function () {
    $(this.input).addClass('invalid');
  },

  onKeyUp: function () {
    $(this.input).removeClass('invalid');
  },

  render: function() {
    return (
      <div className="form-input-container">
        <input type="text" className="form-input" placeholder={this.props.data.placeholder || ''} defaultValue={this.props.data.defaultValue || ''} onKeyUp={this.onKeyUp} ref={this.setInputRef}/>
      </div>
    );
  }
});