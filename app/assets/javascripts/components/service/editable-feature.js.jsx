var EditableFeature = React.createClass({

  setFeatureRef: function (ref) {
    this.feature = ref;
  },

  setPlansContainerRef: function (ref) {
    this.plansContainer = ref;
  },

  getPlans: function () {
    return this.props.plans.map(function (plan) {
      return <div className="feature-for-plan"><div className="plan-name">{plan.name}</div><div className="feature-value-container"><input type="text" className="feature-value" defaultValue={feature.values[plan.id]} placeholder="Value" /><span className="or">OR</span><div className="feature-included">Included<input type="checkbox" /></div></div></div>
    });
  },

  serialize: function () {
    var values = {};

    var planIds = _.map(this.props.plans, function (plan) {
      return plan.id;
    });

    _.map($(this.plansContainer).children(), function (el, i) {
      // forget checkbox for now and just return value
      values[planIds[i]] = $(el).find('.feature-value').val().trim();
    });

    return {
      feature: $(this.feature).val().trim(),
      values: values
    }
  },

  render: function() {
    return (
      <div className="editable-feature">
        <div className="feature-name-container">
          <input type="text" className="feature-name" placeholder="Feature" defaultValue={this.props.feature.feature} ref={this.setFeatureRef}/>
        </div>
        <div className="plans-container" ref={this.setPlansContainerRef}>{this.getPlans()}</div>
      </div>
    );
  }
});