var ModalSelectionAttributes = React.createClass({

  getInitialState: function () {
    return {
      selection: this.props.data.selectedIndex || 0
    };
  },

  updateAttrs: function (index) {
    this.props.data.selectedIndex = index;
    this.setState({ selection: index });
  },

  getFeatures: function () {
    var index = this.state.selection;

    if (this.state.selection != this.props.data.selectedIndex) {
      index = this.props.data.selectedIndex;
    }

    var planSlug = this.props.data.plans[index].slug;

    return this.props.data.headline_features.map(function (feature) {
      var value = feature.values[planSlug];

      if (value == 'CHECK') {
        value = <i className="fa fa-check yes"></i>;
      }

      return <div className="feature"><div className="feature-name">{feature.feature}</div><div className="feature-value">{value}</div></div>;
    });
  },

  render: function() {
    return (
      <div key={Date.now()} className="modal-selection-attrs">{this.getFeatures()}</div>
    );
  }
});