var NoAppsForTier = React.createClass({

  showAddNewApp: function () {
    React.modal.show('app:create', {
      selectedIndex: this.props.stage,
      tierUUIDs: this.props.tierUUIDs
    }, {
      onConfirm: this.createNewApp
    });
  },

  createNewApp: function (data) {
    var self = this;

    React.post('/apps', {
      name: data.name,
      tier_uuid: data.tier_uuid
    }, {
      success: function (newData) {
        self.props.onNewAppCreated(newData.apps);
      }
    });
  },

  render: function() {
    return (
      <div className="no-apps-for-tier">No apps exist yet for this tier. <span onClick={this.showAddNewApp} className="add-first-app-to-tier">Click to add one.</span></div>
    );
  }
});