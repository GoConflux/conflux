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

  getDestPathInput: function (job) {
    if (job.restrictPathMod) {
      return <div className="dest-path">{job.asset.path}</div>;
    } else {
      return <input className="dest-path" defaultValue={job.asset.path} placeholder="Ex: config/initializers/my_file.rb"/>;
    }
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

  formatJob: function () {
    var job = this.props.data;

    switch (job.action) {
      case this.jobTypes.newFile:
        return <div className="editable-job"><div className="ej-input-title dest">Project Destination Path:</div>{this.getDestPathInput(job)}<div className="ej-input-title file">File:</div><div className="upload-file-btn">Upload File</div></div>;
        break;
      case this.jobTypes.newLibrary:
        return <div className="editable-job"><div className="ej-input-title lang">Language:</div><FormSelect required={true} data={this.langSelectData()} ref={this.setLangSelectRef} /><input type="text" className="editable-library-input" placeholder={this.libNamePlaceholder(job.asset.lang)} defaultValue={job.asset.name} ref={this.setLibraryNameRef}/><input type="text" className="editable-library-input" placeholder="Ex: ~> 1.2.0" defaultValue={job.asset.version} ref={this.setLibraryVersionRef}/></div>;
        break;
    }
  },

  render: function() {
    return (
      <div className="editable-job-container">
        {this.formatJob()}
      </div>
    );
  }
});