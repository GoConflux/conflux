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

    var name = $('.config-vars-list > li.new .key-name-input').val();
    var value = $('.config-vars-list > li.new .key-val-input').val();

    React.post('/keys', {
      name: name,
      value: value,
      app_addon_uuid: this.props.data.app_addon_uuid
    }, {
      success: function (keys) {
        self.setState({ keys: keys });
      }
    });
  },

  onUpdateKeys: function (keys) {
    this.setState({ keys: keys });
  },

  formatConfigVars: function () {
    var self = this;

    var configs = this.state.keys.map(function (key) {
      return <li><ConfigVar onUpdateKeys={self.onUpdateKeys} data={key} /></li>;
    });

    configs.push(<li className="new"><ConfigVar data={{ isNew: true }} onAddNewKey={this.onAddNewKey}/></li>);

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