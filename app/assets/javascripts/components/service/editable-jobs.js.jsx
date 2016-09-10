var EditableJobs = React.createClass({

  jobTypes: {
    newFile: 'new_file',
    newLibrary: 'new_library'
  },

  langTypes: {
    ruby: 'ruby'
  },

  newJob: function (type) {
    var job;

    switch (type) {
      case this.jobTypes.newFile:
        job = this.newFileAsset();
        break;
      case this.jobTypes.newLibrary:
        job = this.newLibraryAsset();
        break;
    }

    job.action = type;
    job.id = 'JOB_ID';

    return job;
  },

  newFileAsset: function () {
    return {
      asset: {
        path: '',
        contents: ''
      }
    };
  },

  newLibraryAsset: function () {
    return {
      asset: {
        lang: this.langTypes.ruby,
        name: '',
        version: ''
      }
    }
  },

  addGettingStartedFile: function (fileJobs) {
    if (fileJobs.length == 0) {
      var gettingStartedJob = this.newJob(this.jobTypes.newFile);
      gettingStartedJob.asset.path = './conflux/' + this.props.data.slug + '/getting-started.\<ext\>';
      gettingStartedJob.restrictPathMod = true;
    }

    return fileJobs;
  },

  formatJobs: function (jobs) {
    return (jobs || []).map(function (job) {
      return <EditableJob data={job} key={Math.random()} />;
    });
  },

  render: function() {
    var fileJobs = [];
    var libraryJobs = [];
    var jobs = this.props.data.jobs || {};

    for (var jobId in jobs) {
      var data = jobs[jobId];
      data.id = jobId;

      if (data.action == this.jobTypes.newFile) {
        fileJobs.push(data);
      } else if (data.action == this.jobTypes.newLibrary) {
        libraryJobs.push(data);
      }
    }

    fileJobs = this.addGettingStartedFile(fileJobs);

    return (
      <div className="editable-jobs">
        <div className="files ej-section">
          <div className="ej-section-title">Files</div>
          <div className="ej-section-content">
            {this.formatJobs(fileJobs)}
          </div>
        </div>
        <div className="libraries ej-section">
          <div className="ej-section-title">Libraries</div>
          <div className="ej-section-content">
            {this.formatJobs(libraryJobs)}
          </div>
        </div>
      </div>
    );
  }
});