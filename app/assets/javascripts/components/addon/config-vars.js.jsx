var ConfigVars = React.createClass({

  getInitialState: function () {
    return {
      keys: this.props.data.keys
    }
  },

  onAddNewKey: function (e) {
    var self = this;
    e.preventDefault();
    e.stopPropagation();

    React.post('/keys', {
      name: this.newKeyName(),
      value: this.newKeyVal(),
      description: this.newKeyDescription(),
      app_addon_uuid: this.props.data.app_addon_uuid
    }, {
      success: function (keys) {
        self.onUpdateKeys(keys);
      }
    });
  },

  newKeyName: function () {
    return $('.config-vars-list > li.new .key-name-input').val().trim();
  },

  newKeyVal: function () {
    return $('.config-vars-list > li.new .key-val-input').val().trim();
  },

  newKeyDescription: function () {
    return $('.config-vars-list > li.new .new-config-description').val().trim();
  },

  onUpdateKeys: function (keys) {
    this.setState({ keys: keys });
    $('[data-toggle=tooltip]').tooltip();

  },

  formatConfigVars: function () {
    var self = this;

    var configs = this.state.keys.map(function (key, i) {
      return <li><ConfigVar onUpdateKeys={self.onUpdateKeys} writeAccess={self.props.writeAccess} data={key} /></li>;
    });

    if (this.props.writeAccess) {
      configs.push(<li className="new"><ConfigVar data={{ isNew: true }} onAddNewKey={this.onAddNewKey}/></li>);
    }

    return configs;
  },

  render: function() {
    return (
      <div>
        <div className="app-addon-subsection-title">Config Vars</div>
        <ul className="config-vars-list">{this.formatConfigVars()}</ul>
      </div>
    );
  }
});