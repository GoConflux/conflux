var Pipeline = React.createClass({

  tiersMap: {},

  setHeaderRef: function (ref) {
    this.pipelineHeader = ref;
  },

  setDropdownRef: function (ref) {
    this.settingsDropdown = ref;
  },

  componentDidMount: function () {
    var self = this;

    document.addEventListener('click', function () {
      self.settingsDropdown.hideDropdown();
    });

    var settingsIcon = document.getElementById('settingsIcon');

    if (settingsIcon) {
      settingsIcon.addEventListener('click', function (e) {
        self.settingsDropdown.toggleVisibility();
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }
  },

  componentWillMount: function () {
    try {
      this.tierUUIDs = _.map(this.props.tiers || [], function (tier) {
        return tier.uuid;
      });
    } catch (e) {}
  },

  formatTiers: function () {
    var self = this;

    return this.props.tiers.reverse().map(function (tier) {
      return <li><Tier tierUUIDs={self.tierUUIDs} data={tier} ref={self.addTierToTiersMap} /></li>;
    });
  },

  addTierToTiersMap: function (ref) {
    this.tiersMap[ref.props.data.uuid] = ref;
  },

  getSettingsDropdownOptions: function () {
    var self = this;

    return [
      {
        text: 'Edit',
        iconClasses: 'fa fa-pencil',
        onClick: function () {
          self.editPipeline();

          setTimeout(function () {
            self.settingsDropdown.toggleVisibility();
          }, 50);
        }
      },
      {
        text: 'Delete Pipeline',
        iconClasses: 'fa fa-trash',
        onClick: function () {
          self.confirmDeletePipeline();

          setTimeout(function () {
            self.settingsDropdown.toggleVisibility();
          }, 50);
        }
      }
    ]
  },

  editPipeline: function () {
    React.modal.show('pipeline:update', {
      name: this.pipelineHeader.state.name,
      description: this.pipelineHeader.state.description
    }, {
      onConfirm: this.updatePipeline
    });
  },

  updatePipeline: function (data) {
    var self = this;

    React.put('/pipelines', {
      name: data.name,
      description: data.description,
      pipeline_uuid: this.props.pipeline_uuid
    }, {
      success: function (newData) {
        self.pipelineHeader.setState({
          name: newData.name,
          description: newData.description
        });

        if (newData.url) {
          window.location = newData.url;
        } else {
          React.modal.hide();
        }
      }
    });
  },

  confirmDeletePipeline: function () {
    var self = this;

    React.modal.show('pipeline:delete', null, {
      onConfirm: function () {
        React.delete('/pipelines', { pipeline_uuid: self.props.pipeline_uuid }, {
          success: function (data) {
            window.location = data.url;
          }
        });
      }
    });
  },

  newAppCreated: function (data) {
    this.tiersMap[data.updated_tier].setState({ apps: data.apps });
  },

  render: function() {
    return (
      <div id="pipeline">
        <div className="settings-icon-container">
          <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/gear.png" id="settingsIcon"/>
          <Dropdown customID={'pipelineSettingsDropdown'} data={this.getSettingsDropdownOptions()} ref={this.setDropdownRef} />
        </div>
        <PipelineHeader tierUUIDs={this.tierUUIDs} data={this.props} onNewAppCreated={this.newAppCreated} ref={this.setHeaderRef} />
        <ul id="tiersList">{this.formatTiers()}</ul>
      </div>
    );
  }
});