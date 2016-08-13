var AppAddon = React.createClass({

  setPlanRef: function (ref) {
    this.plansComp = ref;
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

    $('[data-toggle=tooltip]').tooltip();
  },

  setDescriptionRef: function (ref) {
    var self = this;
    this.description = ref;

    $(this.description).blur(function () {
      var val = $(this).val();

      if (val != self.props.description) {
        self.props.description = val;
        self.updateDescription(val);
      }
    });
  },

  setDropdownRef: function (ref) {
    this.settingsDropdown = ref;
  },

  updateDescription: function (val) {
    React.put('/app_addons/update_description', {
      app_addon_uuid: this.props.app_addon_uuid,
      description: val
    });
  },

  formatLinksList: function () {
    return this.props.links.map(function (link) {
      return <li><a href={link.href}>{link.name}</a></li>;
    });
  },

  onPlanSelected: function (e) {
    var self = this;

    if (!this.props.write_access) {
      return;
    }

    React.get('/addons/modal_info', { addon_uuid: this.props.addon_uuid }, {
      success: function (data) {
        data.app_uuid = self.props.app_uuid;
        data.selectedIndex = Number($(e.target).closest('li').attr('data-plan-index')) || 0;
  
        React.modal.show('addon:update', data, { onConfirm: self.updatePlan });
  
        var planInfo = self.props.plan_data.plans[data.selectedIndex];

        if (planInfo.disabled == 'true') {
          mixpanel.track('Paid plan selected', { addon: self.props.name, plan: planInfo.slug });
        }
      }
    });
  },

  updatePlan: function (data) {
    var self = this;

    React.put('/app_addons/update_plan', {
      app_addon_uuid: this.props.app_addon_uuid,
      plan: data.plan
    }, {
      success: function (data) {
        React.modal.hide();
        self.plansComp.setState({ selected: data.selected });
      }
    });
  },

  getSettingsDropdownOptions: function () {
    var self = this;

    return [
      {
        text: 'Remove Service',
        iconClasses: 'fa fa-trash',
        onClick: function () {
          self.confirmRemoveAddon();

          setTimeout(function () {
            self.settingsDropdown.hideDropdown();
          }, 50);
        }
      }
    ]
  },

  confirmRemoveAddon: function () {
    var self = this;

    React.modal.show('addon:delete', { name: this.props.name }, {
      onConfirm: function () {
        React.delete('/app_addons', { app_addon_uuid: self.props.app_addon_uuid }, {
          success: function (data) {
            window.location = data.url;
          }
        });
      }
    });
  },

  getSettingsIcon: function () {
    if (!this.props.write_access) {
      return;
    }

    return <div className="settings-icon-container"><img src="https://ds8ypexjwou5.cloudfront.net/images/gear.png" id="settingsIcon"/><Dropdown customID={'appAddonSettingsDropdown'} data={this.getSettingsDropdownOptions()} ref={this.setDropdownRef} /></div>;
  },

  getAddonDescription: function () {
    if (this.props.write_access) {
      return <div className="description-container"><textarea className="description" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" ref={this.setDescriptionRef}>{this.props.description}</textarea></div>;
    } else {
      return <div className="app-addon-static-description-container"><div className="header-linebreak"></div><div className="static-app-addon-description">{this.props.description}</div></div>;
    }
  },

  getBodyClasses: function () {
    var classes = 'app-addon-body';

    if (!this.props.write_access) {
      classes += ' no-write'
    }

    return classes;
  },

  getConfigVarsClasses: function () {
    var classes = 'config-vars-container';

    if (!this.props.write_access) {
      classes += ' no-write'
    }

    return classes;
  },

  render: function() {
    return (
      <div id="appAddon">
        {this.getSettingsIcon()}
        <div className="app-addon-header">
          <div className="addon-primary-info">
            <img src={this.props.icon} className="icon" />
            <div className="name">{this.props.name}</div>
          </div>
          {this.getAddonDescription()}
        </div>
        <div className={this.getBodyClasses()}>
          <div className={this.getConfigVarsClasses()}>
            <ConfigVars data={this.props} writeAccess={this.props.write_access} />
          </div>
          <div className="plans-links-container">
            <div className="plans-container">
              <Plans data={this.props.plan_data} writeAccess={this.props.write_access} onPlanSelected={this.onPlanSelected} ref={this.setPlanRef} />
            </div>
            <div className="links-container">
              <ul className="links-list">{this.formatLinksList()}</ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
});