var Tier = React.createClass({

  getInitialState: function () {
    return {
      apps: (this.props.data || {}).apps || []
    }
  },

  newAppCreated: function (apps) {
    this.setState({ apps: apps });
  },

  formatApps: function () {
    var self = this;

    if (this.props.hideProd) {
      return <li className="none"><div className="pipeline-view-apps-off-limits">You currently don't have access to production apps.</div></li>;
    }
    
    if (this.state.apps.length == 0) {
      return <li className="none"><NoAppsForTier productionTierUUID={this.props.productionTierUUID} canCreateNewProdApps={this.props.canCreateNewProdApps} preventNewAppsForTier={this.props.preventNewAppsForTier} onNewAppCreated={this.newAppCreated} tierUUIDs={this.props.tierUUIDs} stage={this.props.data.stage} /></li>;
    }

    return this.state.apps.map(function (app) {
      return <a href={app.link}><li><AppListItem data={app} onClone={self.onClone} /></li></a>;
    });
  },
  
  onClone: function (appUUID) {
    React.get('/apps/clone_info', { app_uuid: appUUID }, {
      success: function (data) {
        if (data.no_addons === true) {
          React.modal.show('app:no-addons');
        } else {
          React.modal.show('app:clone', data, { extraDialogClasses: ['clone'] });
        }
      }
    })
  },

  render: function() {
    return (
      <div className="tier">
        <div className="tier-name">{this.props.data.name}</div>
        <ul className="tier-apps-list">{this.formatApps()}</ul>
      </div>
    );
  }
});