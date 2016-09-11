var EditableFeature = React.createClass({

  setEditableFeatureRef: function (ref) {
    this.editableFeature = ref;
  },

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
      var input;
      var value = self.props.feature.values[plan.id];
      var checkMarkClasses = ['feature-included'];

      if (value == 'CHECK') {
        checkMarkClasses.push('checked');
        input = <input type="text" key={Math.random()} className="feature-value" placeholder="Value" onKeyUp={self.removeInvalid} ref={self.setValueInputRef} disabled="disabled"/>;
      } else {
        input = <input type="text" key={Math.random()} className="feature-value" defaultValue={value} placeholder="Value" onKeyUp={self.removeInvalid} ref={self.setValueInputRef} />;
      }

      return <div className="feature-for-plan" key={Math.random()}><div className="plan-name">{plan.name}:</div><div className="feature-value-container"><Checkbox label={'Checkmark'} customClasses={checkMarkClasses} clickHandler={self.onCheckmarkClick} /><span className="or">OR</span>{input}</div></div>
    });
  },

  onCheckmarkClick: function (e, checked) {
    this.removeInvalid();
    var $row = $(e.target).closest('.feature-for-plan');
    var $input = $row.find('.feature-value');
    checked ? this.disableInput($input) : this.enableInput($input);
  },

  disableInput: function ($input) {
    $input.attr('disabled', 'disabled');
  },

  enableInput: function ($input) {
    $input.removeAttr('disabled');
  },

  serialize: function (validate) {
    var values = {};
    var valid = true;

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

      if (validate && _.isEmpty(val)) {
        valid = false;
      }

      values[planIds[i]] = val;
    });

    var data = {
      feature: $(this.feature).val().trim(),
      values: values
    };

    if (validate && _.isEmpty(data.feature)) {
      valid = false;
    }

    if ($(this.headlineFeature).is(':checked')) {
      data.headlineFeature = true;
    }

    if (!valid) {
      $(this.editableFeature).addClass('invalid');
    }

    return { valid: valid, value: data };
  },

  removeFeature: function () {
    this.props.onRemove(this.props.index);
  },

  removeInvalid: function () {
    $(this.editableFeature).removeClass('invalid');
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
      <div className={this.editableFeatureClasses()} ref={this.setEditableFeatureRef}>
        <div className="feature-name-container">
          <input type="text" className="feature-name" placeholder="Feature" defaultValue={this.props.feature.feature} onKeyUp={this.removeInvalid} ref={this.setFeatureRef}/>
          <Checkbox label={'Headline Feature'} customClasses={['headline-feature']} />
          <span className="remove-btn" onClick={this.removeFeature}>&times;</span>
        </div>
        <div className="plans-container" ref={this.setPlansContainerRef}>{this.getPlans()}</div>
      </div>
    );
  }
});