var App = React.createClass({

  getInitialState: function () {
    return {
      showingKey: false
    }
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

  setGridRef: function (ref) {
    this.addonGrid = ref;
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
    this.addonGrid.setState({ addons: data.addons });
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
            self.settingsDropdown.toggleVisibility();
          }, 50);
        }
      },
      {
        text: 'Delete App',
        iconClasses: 'fa fa-trash',
        onClick: function () {
          self.confirmDeleteApp();

          setTimeout(function () {
            self.settingsDropdown.toggleVisibility();
          }, 50);
        }
      }
    ]
  },

  editApp: function () {
    React.modal.show('app:update', {
      defaultName: this.appHeader.state.name,
      selectedIndex: this.props.tier_stage
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

  render: function() {
    return (
      <div id="app">
        <div className="settings-icon-container">
          <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/gear.png" id="settingsIcon"/>
          <Dropdown customID={'appSettingsDropdown'} data={this.getSettingsDropdownOptions()} ref={this.setDropdownRef} />
        </div>
        <AppHeader data={this.props} onCreateNewAddon={this.onCreateNewAddon} ref={this.setHeaderRef} />
        <AddonGrid data={this.props} ref={this.setGridRef} />
        <div className="monthly-cost">Estimated Monthly Cost:<span className="figure">{this.props.monthly_cost}</span></div>
      </div>
    );
  }
});