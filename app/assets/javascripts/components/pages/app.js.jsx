var App = React.createClass({

  getInitialState: function () {
    return {
      showingKey: false
    }
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

  setSharedGridRef: function (ref) {
    this.sharedAddonGrid = ref;
  },

  setPersonalGridRef: function (ref) {
    this.personalAddonGrid = ref;
  },

  setDropdownRef: function (ref) {
    this.settingsDropdown = ref;
  },

  setHeaderRef: function (ref) {
    this.appHeader = ref;
  },

  toggleKeyVisibility: function () {
    this.setState({ showingKey: !this.state.showingKey });
  },

  onCreateNewAddon: function (data) {
    this.sharedAddonGrid.setState({ addons: data.addons.shared });

    if (this.personalAddonGrid) {
      this.personalAddonGrid.setState({ addons: data.addons.personal });
    }

    $('.monthly-cost > .figure').html(data.monthly_cost);
  },

  getSettingsDropdownOptions: function () {
    var self = this;

    return [
      {
        text: 'Edit',
        iconClasses: 'fa fa-pencil',
        onClick: function () {
          self.editApp();

          setTimeout(function () {
            self.settingsDropdown.hideDropdown();
          }, 50);
        }
      },
      {
        text: 'Clone',
        iconClasses: 'fa fa-clone',
        onClick: function () {
          self.onClone();

          setTimeout(function () {
            self.settingsDropdown.hideDropdown();
          }, 50);
        }
      },
      {
        text: 'Delete Bundle',
        iconClasses: 'fa fa-trash',
        onClick: function () {
          self.confirmDeleteApp();

          setTimeout(function () {
            self.settingsDropdown.hideDropdown();
          }, 50);
        }
      }
    ]
  },

  editApp: function () {
    React.modal.show('app:update', {
      defaultName: this.appHeader.state.name,
      selectedIndex: this.props.tier_stage,
      includeProd: this.props.can_bump_to_prod,
      appUUID: this.props.app_uuid
    }, {
      onConfirm: this.updateApp
    });
  },

  updateApp: function (data) {
    var self = this;

    React.put('/apps', {
      name: data.name,
      stage: data.stage,
      app_uuid: this.props.app_uuid
    }, {
      success: function (newData) {
        self.appHeader.setState({ name: newData.name });

        if (newData.url) {
          window.location = newData.url;
        } else {
          React.modal.hide();
        }
      }
    });
  },

  confirmDeleteApp: function () {
    var self = this;

    React.modal.show('app:delete', null, {
      onConfirm: function () {
        React.delete('/apps', { app_uuid: self.props.app_uuid }, {
          success: function (data) {
            window.location = data.url;
          }
        });
      }
    });
  },

  onClone: function () {
    React.get('/apps/clone_info', { app_uuid: this.props.app_uuid }, {
      success: function (data) {
        if (data.no_addons === true) {
          React.modal.show('app:no-addons');
        } else {
          React.modal.show('app:clone', data, { extraDialogClasses: ['clone'] });
        }
      }
    })
  },

  getSettingsIcon: function () {
    if (!this.props.write_access) {
      return;
    }

    return <div className="settings-icon-container"><img src="https://ds8ypexjwou5.cloudfront.net/images/gear.png" id="settingsIcon"/><Dropdown customID={'appSettingsDropdown'} data={this.getSettingsDropdownOptions()} ref={this.setDropdownRef} /></div>;
  },

  getPersonalAddonsGrid: function () {
    return this.props.write_access ? <AddonGrid addons={this.props.addons.personal} group={'Personal'} personal={true} writeAccess={this.props.write_access} ref={this.setPersonalGridRef} /> : null;
  },

  render: function() {
    return (
      <div id="app">
        {this.getSettingsIcon()}
        <AppHeader data={this.props} onCreateNewAddon={this.onCreateNewAddon} ref={this.setHeaderRef} />
        <AddonGrid addons={this.props.addons.shared} personal={false} group={this.props.write_access ? 'Shared' : null} writeAccess={this.props.write_access} ref={this.setSharedGridRef} />
        {this.getPersonalAddonsGrid()}
        <div className="monthly-cost">Estimated Monthly Cost:<span className="figure">{this.props.monthly_cost}</span></div>
      </div>
    );
  }
});