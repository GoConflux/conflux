var EditableFeature = React.createClass({

  setFeatureRef: function (ref) {
    this.feature = ref;
  },

  setPlansContainerRef: function (ref) {
    this.plansContainer = ref;
  },

  setHeadlineFeatureRef: function (ref) {
    this.headlineFeature = ref;
  },

  getPlans: function () {
    return this.props.plans.map(function (plan) {
      return <div className="feature-for-plan"><div className="plan-name">{plan.name}</div><div className="feature-value-container"><input type="text" className="feature-value" defaultValue={feature.values[plan.id]} placeholder="Value" /><span className="or">OR</span><div className="feature-included">Included<input type="checkbox" name="check-feature"/></div></div></div>
    });
  },

  serialize: function () {
    var values = {};


    var planIds = _.map(this.props.plans, function (plan) {
      return plan.id;
    });

    _.map($(this.plansContainer).children(), function (el, i) {
      var val;
      // if check feature is selected, return 'CHECK' as the value
      if ($(el).find('[name=check-feature]').selected()) {
        val = 'CHECK';
      }
      // otherwise, use the value from the feature-value input
      else {
        val = $(el).find('.feature-value').val().trim();
      }

      values[planIds[i]] = val;
    });

    var data = {
      feature: $(this.feature).val().trim(),
      values: values
    };

    if ($(this.headlineFeature).selected()) {
      data.headlineFeature = true;
    }

    return data;
  },

  render: function() {
    return (
      <div className="editable-feature">
        <div className="feature-name-container">
          <input type="text" className="feature-name" placeholder="Feature" defaultValue={this.props.feature.feature} ref={this.setFeatureRef}/>
          <input type="checkbox" name="headline-feature" ref={this.setHeadlineFeatureRef}/>
        </div>
        <div className="plans-container" ref={this.setPlansContainerRef}>{this.getPlans()}</div>
      </div>
    );
  }
});