var EditableFeatures = React.createClass({

  featureRefs: [],

  setEditableFeaturesRef: function (ref) {
    this.editableFeatures = ref;
  },

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
      return <EditableFeature key={Math.random()} feature={feature} plans={self.state.plans} last={i == (self.state.features.length - 1)} index={i} onRemove={self.removeFeature} ref={self.pushFeatureRef} />
    });
  },

  pushFeatureRef: function (ref) {
    if (ref) {
      this.featureRefs.push(ref);
    }
  },

  removePlan: function (planId) {
    var features = this.serialize(false).value;
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
    var features = this.serialize(false).value;
    var plans = _.clone(this.state.plans);

    plans.push({ id: planId, name: 'Untitled' });

    _.each(features, function (feature) {
      feature.values[planId] = '';
    });

    this.setState({ features: features, plans: plans });
  },

  updatePlanName: function (planName, planId) {
    planName = planName || 'Untitled';
    var plans = _.clone(this.state.plans);

    _.each(plans, function (plan) {
      if (plan.id == planId) {
        plan.name = planName;
      }
    });

    this.setState({ features: this.serialize(false).value, plans: plans });
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
    var features = this.serialize(false).value;
    features.push(this.emptyFeature());
    $(this.editableFeatures).removeClass('invalid');
    this.setState({ features: features, plans: this.state.plans });
  },

  removeFeature: function (index) {
    var features = this.serialize(false).value;
    features.splice(index, 1);
    this.setState({ features: features, plans: this.state.plans });
  },

  serialize: function (validate) {
    var data = [];
    var valid = true;

    if (validate == null) {
      validate = this.props.required;
    }

    _.each(this.featureRefs, function (feature, i) {
      var featureInfo = feature.serialize(validate);
      var featureData = _.extend(featureInfo.value, { index: i});

      if (!featureInfo.valid) {
        valid = false;
      }

      data.push(featureData);
    });

    if (validate && _.isEmpty(data)) {
      $(this.editableFeatures).addClass('invalid');
    }

    return { valid: valid, value: data };
  },

  render: function() {
    return (
      <div className="editable-features" ref={this.setEditableFeaturesRef}>
        {this.getFeatures()}
        <div className="new-row-btn" onClick={this.addNewFeature}>New Feature</div>
      </div>
    );
  }
});