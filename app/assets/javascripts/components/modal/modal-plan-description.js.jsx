var ModalPlanDescription = React.createClass({

  getInitialState: function () {
    return {
      selection: this.props.data.selectedIndex || 0
    };
  },

  updatePlan: function (index) {
    this.props.data.selectedIndex = index;
    this.setState({ selection: index });
  },

  getDescription: function () {
    var index = this.state.selection;

    if (this.state.selection != this.props.data.selectedIndex) {
      index = this.props.data.selectedIndex;
    }

    var planData = this.props.data.plans[index];

    return this.props.data.headline_features.map(function (feature) {
      return <div className="plan-feature"><div className="addon-feature-name">{feature}</div><div className="addon-feature-value">{planData[feature]}</div></div>;
    });
  },

  render: function() {
    return (
      <div key={Date.now()} className="modal-plan-description">{this.getDescription()}</div>
    );
  }
});