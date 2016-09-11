var UploadIcon = React.createClass({

  setIconRef: function (ref) {
    this.icon = ref;
  },

  getIcon: function () {
    return this.props.data.icon || 'no-icon-url'; // add this
  },

  serialize: function () {
    var valid = true;
    var value = null; // set this to the file picker file.

    if (this.props.required && _.isEmpty(value)) {
      valid = false;
      this.showInvalid();
    }

    return { valid: valid, value: value };
  },

  showInvalid: function () {
    $(this.icon).addClass('invalid');
  },

  removeInvalid: function () {
    $(this.icon).removeClass('invalid');
  },

  render: function() {
    return (
      <div className="upload-icon">
        <div className="icon-preview-container">
          <img src={this.getIcon()} className="icon-preview" ref={this.setIconRef} />
        </div>
        <div className="icon-upload-container">
          <UploadFileButton btnText={'Upload Icon'} fileName={(this.props.data.icon || '').split('/').pop()} clickHandler={this.removeInvalid} />
        </div>
      </div>
    );
  }
});