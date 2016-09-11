var UploadFileButton = React.createClass({

  getFileNameClasses: function () {
    var classes = 'file-name';

    if (!this.props.fileName) {
      classes += 'no-file';
    }

    return classes;
  },

  render: function() {
    return (
      <div className="upload-file">
        <div className="upload-file-btn">Upload File</div>
        <div className={this.getFileNameClasses()}>{this.props.fileName || 'No file selected'}</div>
      </div>
    );
  }
});