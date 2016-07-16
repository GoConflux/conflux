var NoAppsForTier = React.createClass({

  showAddNewApp: function () {
    React.modal.show('app:create', {
      selectedIndex: this.props.stage,
      tierUUIDs: this.getTierUUIDsBasedOnPermissions(),
      includeProd: this.props.canCreateNewProdApps
    }, {
      onConfirm: this.createNewApp
    });
  },
  
  getTierUUIDsBasedOnPermissions: function () {
    if (this.props.canCreateNewProdApps) {
      return this.props.tierUUIDs;
    }
    
    return _.without(this.props.tierUUIDs, this.props.productionTierUUID);
  },

  createNewApp: function (data) {
    var self = this;

    React.post('/apps', {
      name: data.name,
      tier_uuid: data.tier_uuid
    }, {
      success: function (newData) {
        React.modal.hide();
        self.props.onNewAppCreated(newData.apps);
      }
    });
  },

  getText: function () {
    if (this.props.preventNewAppsForTier) {
      return <span>No bundles exist yet for this tier.</span>;
    }

    return <span>No bundles exist yet for this tier.&nbsp;&nbsp;<span onClick={this.showAddNewApp} className="add-first-app-to-tier">Click to add one.</span></span>;
  },

  render: function() {
    return (
      <div className="no-apps-for-tier">{this.getText()}</div>
    );
  }
});