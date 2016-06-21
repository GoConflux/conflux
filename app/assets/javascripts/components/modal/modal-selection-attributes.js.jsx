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

    var info = this.props.data.info[index];

    return this.props.data.headline_features.map(function (feature) {
      var value = info[feature];

      if (value === 'yes') {
        value = <i className="fa fa-check yes"></i>;
      } else if (value === 'no') {
        value = <i className="fa fa-times no"></i>;
      }

      return <div className="feature"><div className="feature-name">{feature}</div><div className="feature-value">{value}</div></div>;
    });
  },

  render: function() {
    return (
      <div key={Date.now()} className="modal-selection-attrs">{this.getFeatures()}</div>
    );
  }
});