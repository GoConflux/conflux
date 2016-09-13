var UploadFileButton = React.createClass({

  setFileInputRef: function (ref) {
    this.fileInput = ref;
  },

  setFileNameRef: function (ref) {
    this.fileName = ref;
  },

  getFileNameClasses: function () {
    var classes = 'file-name';

    if (!this.props.defaultFile) {
      classes += ' no-file';
    }

    return classes;
  },
  
  getAcceptedFileTypes: function () {
    return this.props.image ? 'image/*' : '';
  },

  getFile: function (cb) {
    var file = this.fileInput.files[0];

    if (!file) {
      cb(this.props.defaultFile);
      return;
    }

    var fr = new FileReader();

    fr.onload = function () {
      cb(fr.result);
    };

    fr.readAsDataURL(file);
  },

  onClick: function () {
    if (this.props.clickHandler) {
      this.props.clickHandler();
    }

    $(this.fileInput).click();
  },

  getFileName: function () {
    return (this.fileInput.files[0] || {}).name || 'No file selected';
  },

  defaultFileName: function () {
    return (this.props.defaultFile || '').split('/').pop() || 'No file selected';
  },

  onFileChange: function () {
    $(this.fileName).html(this.getFileName()).removeClass('no-file');

    if (this.props.onFileChange) {
      this.getFile(this.props.onFileChange);
    }
  },

  render: function() {
    return (
      <div className="upload-file">
        <div className="upload-file-btn" onClick={this.onClick}>
          <span>{this.props.btnText || 'Upload File'}</span>
          <input type="file" accept={this.getAcceptedFileTypes()} className="file-input" onChange={this.onFileChange} ref={this.setFileInputRef}/>
        </div>
        <div className={this.getFileNameClasses()} ref={this.setFileNameRef}>{this.defaultFileName()}</div>
      </div>
    );
  }
});