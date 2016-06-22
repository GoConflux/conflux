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
    if (this.props.hideProd) {
      return <li className="none"><div className="pipeline-view-apps-off-limits">You currently don't have access to production apps.</div></li>;
    }
    
    if (this.state.apps.length == 0) {
      return <li className="none"><NoAppsForTier onNewAppCreated={this.newAppCreated} tierUUIDs={this.props.tierUUIDs} stage={this.props.data.stage} /></li>;
    }

    return this.state.apps.map(function (app) {
      return <a href={app.link}><li><AppListItem data={app} /></li></a>;
    });
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