var CategoryAddonsGrid = React.createClass({

  formatAddons: function () {
    return this.props.data.map(function (addon) {
      return <div className="addon-wrapper"><Addon data={addon} /></div>;
    });
  },

  render: function() {
    return (
      <div className="addon-grid">{this.formatAddons()}</div>
    );
  }
});