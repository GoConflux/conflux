var EditableJob = React.createClass({

  jobTypes: {
    newFile: 'new_file',
    newLibrary: 'new_library'
  },

  langNameType: {
    ruby: 'Gem'
  },

  libNamePlaceholder: function (lang) {
    var type = this.langNameType[lang];
    return type ? (type + ' name') : 'Name';
  },

  setLangSelectRef: function (ref) {
    this.langSelect = ref;
  },

  setLibraryNameRef: function (ref) {
    this.libraryName = ref;
  },

  setLibraryVersionRef: function (ref) {
    this.libraryVersion = ref;
  },

  setDestPathRef: function (ref) {
    this.destPath = ref;
  },

  setFileUploaderRef: function (ref) {
    this.fileUploader = ref;
  },
  
  langSelectData: function () {
    return {
      options: [
        {
          text: 'Ruby',
          value: 'ruby'
        }
      ],
      defaultValue: 'ruby'
    };
  },

  stripFileName: function (file) {
    return (file || '').split('/').pop();
  },

  formatJob: function () {
    var job = this.props.data;

    switch (job.action) {
      case this.jobTypes.newFile:
        return <div className="editable-job"><div className="ej-input-title dest">Project Destination Path:</div><input className="dest-path" defaultValue={job.asset.path} placeholder="Ex: config/initializers/my_file.rb" ref={this.setDestPathRef}/><UploadFileButton fileName={this.stripFileName(job.asset.contents)} ref={this.setFileUploaderRef} /><div className="remove-btn" onClick={this.onRemove}>&times;</div></div>;
        break;
      case this.jobTypes.newLibrary:
        return <div className="editable-job"><div className="ej-input-title lang">Language:</div><FormSelect required={true} data={this.langSelectData()} ref={this.setLangSelectRef} /><input type="text" className="editable-library-input" placeholder={this.libNamePlaceholder(job.asset.lang)} defaultValue={job.asset.name} ref={this.setLibraryNameRef}/><input type="text" className="editable-library-input" placeholder="Ex: ~> 1.2.0" defaultValue={job.asset.version} ref={this.setLibraryVersionRef}/><div className="remove-btn" onClick={this.onRemove}>&times;</div></div>;
        break;
    }
  },

  onRemove: function () {
    if (this.props.onRemove) {
      this.props.onRemove(this.props.data.id);
    }
  },

  serialize: function () {
    var data = {
      action: this.props.data.action,
      id: this.props.data.id
    };

    switch (data.action) {
      case this.jobTypes.newFile:
        data.asset = {
          path: $(this.destPath).val().trim(),
          contents: this.fileUploader.getFile()
        };
        break;
      case this.jobTypes.newLibrary:
        data.asset = {
          lang: this.langSelect.serialize().value,
          name: $(this.libraryName).val().trim(),
          version: $(this.libraryVersion).val().trim()
        };
        break;
    }

    return data;
  },

  render: function() {
    return (
      <div className="editable-job-container">
        {this.formatJob()}
      </div>
    );
  }
});