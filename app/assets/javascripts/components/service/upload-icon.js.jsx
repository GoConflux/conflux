var UploadIcon = React.createClass({

  setIconUploadContainerRef: function (ref) {
    this.iconUploadContainer = ref;
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
    $(this.iconUploadContainer).addClass('invalid');
  },

  render: function() {
    return (
      <div className="upload-icon">
        <div className="icon-preview-container">
          <img src={this.getIcon()} className="icon-preview" />
        </div>
        <div className="icon-upload-container" ref={this.setIconUploadContainerRef}>
          <UploadFileButton btnText={'Upload Icon'} fileName={(this.props.data.icon || '').split('/').pop()} />
        </div>
      </div>
    );
  }
});