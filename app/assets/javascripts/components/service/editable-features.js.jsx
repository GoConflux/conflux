var EditableFeatures = React.createClass({

  featureRefs: [],

  getInitialState: function () {
    return {
      features: this.props.data.features,
      plans: this.props.data.plans
    };
  },

  getFeatures: function () {
    var self = this;
    this.featureRefs = [];

    return this.state.features.map(function (feature, i) {
      return <EditableFeature key={Math.random()} feature={feature} plans={self.state.plans} last={i == (self.state.features.length - 1)} ref={self.pushFeatureRef} />
    });
  },

  pushFeatureRef: function (ref) {
    this.featureRefs.push(ref);
  },

  removePlan: function (planId) {
    var features = this.serialize();
    var plans = _.clone(this.state.plans);

    var planIndex = _.findIndex(plans, function (plan) {
      return plan.id == planId;
    });

    plans.splice(planIndex, 1);

    _.each(features, function (feature) {
      delete feature.values[planId];
    });

    this.setState({ features: features, plans: plans });
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

  serialize: function () {
    return _.map(this.featureRefs, function (feature, i) {
      return _.extend(feature.serialize(), { index: i });
    });
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