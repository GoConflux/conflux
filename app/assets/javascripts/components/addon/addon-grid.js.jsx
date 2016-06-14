var AddonGrid = React.createClass({

  getInitialState: function () {
    return {
      addons: (this.props.data || {}).addons || []
    }
  },

  formatAddons: function () {
    if (this.state.addons.length == 0) {
      return <div className="no-addons-view">This app doesn't have any add-ons yet.<br />Use the search above to find and add some.</div>
    } else {
      return this.state.addons.map(function (addon) {
        return <div className="addon-wrapper"><Addon data={addon} /></div>;
      });
    }
  },

  render: function() {
    return (
      <div className="addon-grid">{this.formatAddons()}</div>
    );
  }
});