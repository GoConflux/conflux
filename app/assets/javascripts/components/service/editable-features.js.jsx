var EditableFeatures = React.createClass({

  getInitialState: function () {
    return {
      features: this.props.data.features,
      plans: this.props.data.plans
    };
  },

  getFeatures: function () {
    var self = this;

    return this.state.features.map(function (feature) {
      return <EditableFeature feature={feature} plans={self.state.plans} />
    });
  },

  removePlan: function (planId) {

  },

  addPlan: function (planId) {
    var features = this.serialize();
    var plans = _.clone(this.state.plans);

    plans.push({ id: planId, name: 'Untitled' });

    _.each(features, function (feature) {
      feature.values[planId] = '';
    });

    this.setState({ features: features, plans: plans });
  },

  updatePlanName: function (planName, planId) {
    var plans = _.clone(this.state.plans);

    _.each(plans, function (plan) {
      if (plan.id == planId) {
        plan.name = planName;
      }
    });

    this.setState({ features: this.serialize(), plans: plans });
  },

  emptyFeature: function () {
    var valuesMap = {};

    _.each(this.state.plans, function (plan) {
      valuesMap[plan.id] = '';
    });

    return {
      feature: '',
      values: valuesMap,
      index: this.state.features.length - 1
    };
  },

  addNewFeature: function () {
    var features = this.serialize();
    features.push(this.emptyFeature());
    this.setState({ features: features, plans: this.state.plans });
  },

  render: function() {
    return (
      <div className="editable-features">
        {this.getFeatures()}
        <div className="new-row-btn" onClick={this.addNewFeature}>New Feature</div>
      </div>
    );
  }
});