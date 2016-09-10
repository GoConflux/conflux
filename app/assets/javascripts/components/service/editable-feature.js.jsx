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

  setCheckmarkInputRef: function (ref) {
    this.checkmarkInput = ref;
  },

  setValueInputRef: function (ref) {
    this.valueInput = ref;
  },

  getPlans: function () {
    var self = this;

    return this.props.plans.map(function (plan) {
      return <div className="feature-for-plan" key={Math.random()}><div className="plan-name">{plan.name}:</div><div className="feature-value-container"><Checkbox label={'Checkmark'} customClasses={['feature-included']} clickHandler={self.onCheckmarkClick} /><span className="or">OR</span><input type="text" className="feature-value" defaultValue={self.props.feature.values[plan.id]} placeholder="Value" ref={self.setValueInputRef} /></div></div>
    });
  },

  onCheckmarkClick: function (checked) {
    console.log(checked);
  },

  serialize: function () {
    var values = {};

    var planIds = _.map(this.props.plans, function (plan) {
      return plan.id;
    });

    _.map($(this.plansContainer).children(), function (el, i) {
      var val;
      // if check feature is selected, return 'CHECK' as the value
      if ($(el).find('[name=check-feature]').is(':checked')) {
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

    if ($(this.headlineFeature).is(':checked')) {
      data.headlineFeature = true;
    }

    return data;
  },

  removeFeature: function (e) {

  },

  editableFeatureClasses: function () {
    var classes = 'editable-feature';

    if (this.props.last) {
      classes += ' last';
    }

    return classes;
  },

  render: function() {
    return (
      <div className={this.editableFeatureClasses()}>
        <div className="feature-name-container">
          <input type="text" className="feature-name" placeholder="Feature" defaultValue={this.props.feature.feature} ref={this.setFeatureRef}/>
          <Checkbox label={'Headline Feature'} customClasses={['headline-feature']} />
          <span className="remove-btn" onClick={this.removeFeature}>&times;</span>
        </div>
        <div className="plans-container" ref={this.setPlansContainerRef}>{this.getPlans()}</div>
      </div>
    );
  }
});