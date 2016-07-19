var PipelineHeader = React.createClass({

  getInitialState: function () {
    return {
      name: (this.props.data || {}).name,
      description: (this.props.data || {}).description
    };
  },

  onNewAppClick: function () {
    var self = this;

    React.modal.show('app:create', {
      selectedIndex: 0,
      tierUUIDs: this.getTierUUIDsBasedOnPermissions(),
      includeProd: this.props.canCreateNewProdApps
    }, {
      onConfirm: function (data) {
        React.post('/apps', {
          name: data.name,
          tier_uuid: data.tier_uuid
        }, {
          success: function (newData) {
            React.modal.hide();
            self.props.onNewAppCreated(newData);
          }
        });
      }
    });
  },

  getTierUUIDsBasedOnPermissions: function () {
    if (this.props.canCreateNewProdApps) {
      return this.props.tierUUIDs;
    }

    return _.without(this.props.tierUUIDs, this.props.productionTierUUID);
  },

  getDescription: function () {
    return this.state.description ? this.state.description : <span className="no-description">No description</span>;
  },

  render: function() {
    return (
      <div id="pipelineHeader">
        <div className="pipeline-header-left">
          <img src="https://ds8ypexjwou5.cloudfront.net/images/pipeline-dark.svg" className="pipeline-icon"/>
          <div className="pipeline-name">{this.state.name}</div>
          <div className="header-linebreak"></div>
          <div className="pipeline-description">{this.getDescription()}</div>
        </div>
        <div className="pipeline-header-right">
          <div onClick={this.onNewAppClick} className="new-app-btn">New Bundle&nbsp;&nbsp;<span className="plus">+</span></div>
        </div>
      </div>
    );
  }
});