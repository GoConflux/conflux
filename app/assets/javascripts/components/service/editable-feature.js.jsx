var EditableFeature = React.createClass({

  getInitialState: function () {
    return {
      plans: this.props.plans
    }
  },

  getPlans: function () {
    return this.state.plans.map(function (plan) {
      return <div className="feature-for-plan"><div className="plan-name">{plan.name}</div></div>
    });
  },

  render: function() {
    return (
      <div className="editable-feature">
        <div className="feature-name-container">
          <input type="text" className="feature-name" placeholder="Feature" defaultValue={this.props.data.feature}/>
        </div>
        <div className="plans-container">{this.getPlans()}</div>
      </div>
    );
  }
});