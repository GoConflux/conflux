var UploadIcon = React.createClass({

  setIconRef: function (ref) {
    this.icon = ref;
  },

  setUploaderRef: function (ref) {
    this.iconUploader = ref;
  },

  getIcon: function () {
    return this.props.data.icon || 'no-icon-url'; // add this
  },

  serialize: function (cb) {
    var self = this;
    var valid = true;

    this.iconUploader.getFile(function (fileInfo) {
      if (self.props.required && _.isEmpty(fileInfo.data)) {
        valid = false;
        self.showInvalid();
      }

      cb({ valid: valid, value: fileInfo });
    });
  },

  showInvalid: function () {
    $(this.icon).addClass('invalid');
  },

  removeInvalid: function () {
    $(this.icon).removeClass('invalid');
  },

  onIconChange: function (info) {
    $(this.icon).attr('src', info.data);
  },

  render: function() {
    return (
      <div className="upload-icon">
        <div className="icon-preview-container">
          <img src={this.getIcon()} className="icon-preview" ref={this.setIconRef} />
        </div>
        <div className="icon-upload-container">
          <UploadFileButton btnText={'Upload Icon'} image={true} defaultFile={this.props.data.icon} onFileChange={this.onIconChange} clickHandler={this.removeInvalid} ref={this.setUploaderRef} />
        </div>
      </div>
    );
  }
});