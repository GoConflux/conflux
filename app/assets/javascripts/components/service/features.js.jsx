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
      var classes = 'feature';
      var value = data.values[self.state.plan];

      if (!value) {
        classes += ' disabled';
      } else if (value === 'CHECK') {
        value = <img className="feature-check" src="https://ds8ypexjwou5.cloudfront.net/images/check.svg" />;
      }

      return <div className={classes}><div className="name">{data.feature}</div><div className="value">{value}</div></div>;
    });
  },

  featuresClasses: function () {
    if ((this.state.features || []).length > 0) {
      return;
    }

    return 'no-features';
  },

  render: function() {
    return (
      <div id="features" className={this.featuresClasses()}>{this.formatFeatures()}</div>
    );
  }
});