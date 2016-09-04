var Features = React.createClass({

  getInitialState: function () {
    return {
      features: this.props.features,
      plan: this.props.plan
    };
  },

  formatFeatures: function () {
    var self = this;

    return this.state.features.map(function (data) {
      return <div className="feature"><div className="name">{data.feature}</div><div className="value">{data.values[self.state.plan]}</div></div>;
    });
  },

  render: function() {
    return (
      <div id="features">{this.formatFeatures()}</div>
    );
  }
});