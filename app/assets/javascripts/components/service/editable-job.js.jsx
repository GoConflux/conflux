var EditableJob = React.createClass({

  jobTypes: {
    newFile: 'new_file',
    newLibrary: 'new_library'
  },

  langNameType: {
    ruby: 'Gem'
  },

  setEditableJobRef: function (ref) {
    this.editableJob = ref;
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
        return <div className="editable-job" ref={this.setEditableJobRef}><div className="ej-input-title dest">Project Destination Path:</div><input className="dest-path" defaultValue={job.asset.path} placeholder="Ex: config/initializers/my_file.rb" onKeyUp={this.removeInvalid} ref={this.setDestPathRef}/><UploadFileButton clickHandler={this.removeInvalid} fileName={this.stripFileName(job.asset.contents)} ref={this.setFileUploaderRef} /><div className="remove-btn" onClick={this.onRemove}>&times;</div></div>;
        break;
      case this.jobTypes.newLibrary:
        return <div className="editable-job" ref={this.setEditableJobRef}><div className="ej-input-title lang">Language:</div><FormSelect required={true} data={this.langSelectData()} ref={this.setLangSelectRef} /><input type="text" className="editable-library-input" placeholder={this.libNamePlaceholder(job.asset.lang)} defaultValue={job.asset.name} onKeyUp={this.removeInvalid} ref={this.setLibraryNameRef}/><input type="text" className="editable-library-input" placeholder="Ex: ~> 1.2.0" defaultValue={job.asset.version} onKeyUp={this.removeInvalid} ref={this.setLibraryVersionRef}/><div className="remove-btn" onClick={this.onRemove}>&times;</div></div>;
        break;
    }
  },

  removeInvalid: function () {
    $(this.editableJob).removeClass('invalid');
  },

  onRemove: function () {
    if (this.props.onRemove) {
      this.props.onRemove(this.props.data.id);
    }
  },

  serialize: function () {
    var valid = true;

    var data = {
      action: this.props.data.action,
      id: this.props.data.id
    };

    switch (data.action) {
      case this.jobTypes.newFile:
        var path = $(this.destPath).val().trim();
        var contents = this.fileUploader.getFile();

        if (_.isEmpty(path) || !contents) {
          valid = false;
        }

        data.asset = {
          path: path,
          contents: contents
        };

        break;
      case this.jobTypes.newLibrary:
        var name = $(this.libraryName).val().trim();
        var version = $(this.libraryVersion).val().trim();

        if (_.isEmpty(name) || _.isEmpty(version)) {
          valid = false;
        }

        data.asset = {
          lang: this.langSelect.serialize().value,
          name: name,
          version: version
        };

        break;
    }

    if (!valid) {
      $(this.editableJob).addClass('invalid');
    }

    return { valid: valid, value: data };
  },

  render: function() {
    return (
      <div className="editable-job-container">
        {this.formatJob()}
      </div>
    );
  }
});