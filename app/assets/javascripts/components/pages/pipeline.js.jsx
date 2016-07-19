var Pipeline = React.createClass({

  tiersMap: {},

  productionTier: 3,

  setHeaderRef: function (ref) {
    this.pipelineHeader = ref;
  },

  setDropdownRef: function (ref) {
    this.settingsDropdown = ref;
  },

  componentDidMount: function () {
    var self = this;

    document.addEventListener('click', function () {
      if (self.settingsDropdown) {
        self.settingsDropdown.hideDropdown();
      }
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
    var self = this;

    try {
      this.tierUUIDs = _.map(this.props.tiers || [], function (tier) {
        if (tier.stage == self.productionTier) {
          self.productionTierUUID = tier.uuid;
        }

        return tier.uuid;
      });
    } catch (e) {}
  },

  formatTiers: function () {
    var self = this;

    return this.props.tiers.reverse().map(function (tier) {
      return <li><Tier tierUUIDs={self.tierUUIDs} productionTierUUID={self.productionTierUUID} data={tier} hideProd={tier.stage == self.productionTier && !self.props.show_prod_apps} preventNewAppsForTier={tier.stage == self.productionTier && !self.props.can_write_prod_apps} canCreateNewProdApps={self.props.can_write_prod_apps} ref={self.addTierToTiersMap} /></li>;
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
            self.settingsDropdown.hideDropdown();
          }, 50);
        }
      },
      {
        text: 'Delete Pipeline',
        iconClasses: 'fa fa-trash',
        onClick: function () {
          self.confirmDeletePipeline();

          setTimeout(function () {
            self.settingsDropdown.hideDropdown();
          }, 50);
        }
      }
    ]
  },

  editPipeline: function () {
    React.modal.show('pipeline:update', {
      name: this.pipelineHeader.state.name,
      description: this.pipelineHeader.state.description,
      pipelineUUID: this.props.pipeline_uuid
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

  getSettingsIcon: function () {
    if (!this.props.write_access) {
      return;
    }

    return <div className="settings-icon-container"><img src="https://ds8ypexjwou5.cloudfront.net/images/gear.png" id="settingsIcon"/><Dropdown customID={'pipelineSettingsDropdown'} data={this.getSettingsDropdownOptions()} ref={this.setDropdownRef} /></div>;
  },

  render: function() {
    return (
      <div id="pipeline">
        {this.getSettingsIcon()}
        <PipelineHeader tierUUIDs={this.tierUUIDs} productionTierUUID={this.productionTierUUID} data={this.props} onNewAppCreated={this.newAppCreated} canCreateNewProdApps={this.props.can_write_prod_apps} ref={this.setHeaderRef} />
        <ul id="tiersList">{this.formatTiers()}</ul>
      </div>
    );
  }
});