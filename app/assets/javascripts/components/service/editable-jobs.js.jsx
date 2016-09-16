var EditableJobs = React.createClass({

  getInitialState: function () {
    return {
      jobs: this.getInitialJobs()
    };
  },

  jobRefs: [],

  jobTypes: {
    newFile: 'new_file',
    newLibrary: 'new_library'
  },

  langTypes: {
    ruby: 'ruby'
  },

  getInitialJobs: function () {
    var jobs = this.props.data.jobs || {};
    var fileJobsExist = false;

    for (var jobId in jobs) {
      if (jobs[jobId].action == this.jobTypes.newFile) {
        fileJobsExist = true;
      }
    }

    if (!fileJobsExist) {
      var gettingStartedJob = this.newJob(this.jobTypes.newFile);
      gettingStartedJob.asset.path = './conflux/' + this.props.data.slug + '/getting-started.\<ext\>';
      jobs[gettingStartedJob.id] = gettingStartedJob;
      delete jobs[gettingStartedJob.id].id;
    }

    return jobs;
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
    job.id = 'NEW_JOB_' + Math.round(Math.random() * 1000000);

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
    };
  },

  formatJobs: function (jobs) {
    var self = this;

    return (jobs || []).map(function (job) {
      return <EditableJob data={job} key={Math.random()} onRemove={self.onRemoveJob} ref={self.pushRef} />;
    });
  },

  pushRef: function (ref) {
    if (ref) {
      this.jobRefs.push(ref);
    }
  },

  onNewJob: function (type) {
    var self = this;

    this.serialize(function (data) {
      var newJob = self.newJob(type);
      var newJobs = _.clone(data.value);
      newJobs[newJob.id] = newJob;
      self.setState({ jobs: newJobs });
    });
  },

  onNewLibrary: function () {
    this.onNewJob(this.jobTypes.newLibrary);
  },

  onNewFile: function () {
    this.onNewJob(this.jobTypes.newFile);
  },

  onRemoveJob: function (id) {
    var self = this;

    this.serialize(function (data) {
      var newJobs = _.clone(data.value);
      delete newJobs[id];
      self.setState({ jobs: newJobs });
    });
  },

  serialize: function (cb) {
    if (_.isEmpty(this.jobRefs)) {
      var payload = { valid: true, value: {} };

      if (cb) {
        cb(payload);
        return;
      } else {
        return payload;
      }
    }

    this.serializeJob(0, {}, true, cb);
  },

  serializeJob: function (index, jobsMap, valid, cb) {
    var self = this;
    var job = this.jobRefs[index];

    job.serialize(function (jobInfo) {
      var data = jobInfo.value;

      if (!jobInfo.valid) {
        valid = false;
      }

      var jobId = data.id;
      delete data.id;

      jobsMap[jobId] = data;
      
      if (index == self.jobRefs.length - 1) {
        var payload = { valid: valid, value: jobsMap };

        if (!cb) {
          return payload;
        }

        cb(payload);
      } else {
        index++;
        self.serializeJob(index, jobsMap, valid, cb);
      }
    });
  },

  render: function() {
    var fileJobs = [];
    var libraryJobs = [];
    var jobs = this.state.jobs || {};

    for (var jobId in jobs) {
      var data = jobs[jobId];
      data.id = jobId;

      if (data.action == this.jobTypes.newFile) {
        fileJobs.push(data);
      } else if (data.action == this.jobTypes.newLibrary) {
        libraryJobs.push(data);
      }
    }

    this.jobRefs = []; // empty this again

    return (
      <div className="editable-jobs">
        <div className="files ej-section">
          <div className="ej-section-title">Files</div>
          <div className="ej-section-content">
            {this.formatJobs(fileJobs)}
          </div>
          <div className="new-row-btn" onClick={this.onNewFile}>New File</div>
        </div>
        <div className="libraries ej-section">
          <div className="ej-section-title">Libraries</div>
          <div className="ej-section-content">
            {this.formatJobs(libraryJobs)}
          </div>
          <div className="new-row-btn" onClick={this.onNewLibrary}>New Library</div>
        </div>
      </div>
    );
  }
});