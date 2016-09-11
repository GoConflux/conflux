var UploadIcon = React.createClass({

  getIcon: function () {
    return this.props.data.icon || 'no-icon-url'; // add this
  },

  render: function() {
    return (
      <div className="upload-icon">
        <div className="icon-preview-container">
          <img src={this.getIcon()} className="icon-preview" />
        </div>
        <div className="icon-upload-container">
          <UploadFileButton btnText={'Upload Icon'} fileName={(this.props.data.icon || '').split('/').pop()} />
        </div>
      </div>
    );
  }
});