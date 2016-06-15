var AppHeader = React.createClass({

  getInitialState: function () {
    return {
      name: (this.props.data || {}).name
    }
  },

  onAddonSelected: function (uuid) {
    var self = this;

    React.get('/addons/modal_info', { addon_uuid: uuid }, {
      success: function (data) {
        data.app_uuid = self.props.data.app_uuid;
        data.selectedIndex = 0;

        React.modal.show('addon:create', data, { onConfirm: self.createNewAddon });
      }
    });
  },

  createNewAddon: function (data) {
    var self = this;

    React.post('/app_addons', {
      app_uuid: data.app_uuid,
      addon_uuid: data.addon_uuid,
      plan: data.plan
    }, {
      success: function (newData) {
        if (newData.addon_already_exists) {
          alert('Addon alredy exists for this app!');
        } else {
          React.modal.hide();
          self.props.onCreateNewAddon(newData);
        }
      }
    });
  },

  render: function() {
    return (
      <div id="appHeader" key={Date.now()}>
        <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/app-green.svg" className="app-header-icon"/>
        <div className="left-header-title">{this.state.name}</div>
        <div className="header-linebreak"></div>
        <InAppSearchBar onAddonSelected={this.onAddonSelected} />
      </div>
    );
  }
});