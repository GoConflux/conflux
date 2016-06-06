var AddonGrid = React.createClass({

  getInitialState: function () {
    return {
      addons: (this.props.data || {}).addons || []
    }
  },

  formatAddons: function () {
    return this.state.addons.map(function (addon) {
      return <div className="addon-wrapper"><Addon data={addon} /></div>;
    });
  },

  render: function() {
    return (
      <div className="addon-grid">{this.formatAddons()}</div>
    );
  }
});