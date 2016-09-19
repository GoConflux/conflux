var FormInput = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  serialize: function (cb) {
    var valid = true;
    var value = $(this.input).val().trim();

    if (this.props.required && _.isEmpty(value)) {
      valid = false;
      this.showInvalid();
    }

    var data = { valid: valid, value: value };

    if (!cb) {
      return data;
    }

    cb(data);
  },

  showInvalid: function () {
    $(this.input).addClass('invalid');
  },

  onKeyUp: function () {
    $(this.input).removeClass('invalid');

    if (this.props.onKeyUp) {
      this.props.onKeyUp($(this.input).val());
    }
  },

  getInputTitle: function () {
    if (!this.props.inputTitle) {
      return;
    }

    return <div className="form-input-title">{this.props.inputTitle}:</div>;
  },

  getInputClasses: function () {
    var classes = 'form-input';

    if (this.props.inputTitle) {
      classes += ' with-title';
    }

    return classes;
  },

  render: function() {
    return (
      <div className="form-input-container">
        {this.getInputTitle()}
        <input type="text" className={this.getInputClasses()} placeholder={this.props.data.placeholder || ''} defaultValue={this.props.data.defaultValue || ''} onKeyUp={this.onKeyUp} maxLength={this.props.data.maxLength || '524288'} ref={this.setInputRef}/>
      </div>
    );
  }
});