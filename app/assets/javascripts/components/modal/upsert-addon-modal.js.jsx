var UpsertAddonModal = React.createClass({

  serialize: function () {
    return this.props.isNew ? {
      app_uuid: this.props.data.app_uuid,
      addon_uuid: this.props.data.addon_uuid,
      plan: this.planSelectComp.getValue()
    } : {
      plan: this.planSelectComp.getValue()
    };
  },

  onHide: function () {
    if (this.props.isNew) {
      this.forceSelectPlan(0);
      this.enableConfirmBtn();
    }
  },

  forceSelectPlan: function (index) {
    this.planSelectComp.setValue(this.props.data.plans[index].slug);

    this.planDescription.setState({
      selection: index
    });
  },

  onPlanChange: function (val) {
    var plans = this.props.data.plans;
    var index = _.findIndex(plans, function(plan){ return plan.slug == val; });

    this.planDescription.updateAttrs(index);

    var planInfo = plans[index];

    if (planInfo.disabled == 'true') {
      this.disableConfirmBtn();
      mixpanel.track('Paid plan selected', { addon: this.props.data.name, plan: planInfo.slug });
    } else {
      this.enableConfirmBtn();
    }
  },

  disableConfirmBtn: function () {
    React.modal.disableConfirm();
    $('.modal-action-btn.confirm').html('<span><i class="fa fa-lock lock-icon"></i>Plan not currently available</span>').addClass('plan-na');
  },

  enableConfirmBtn: function () {
    React.modal.enableConfirm();
    $('.modal-action-btn.confirm').html((this.props.isNew ? 'Provision' : 'Update')).removeClass('plan-na');
  },

  formatSelectData: function () {
    return {
      title: 'Plan',
      selectedIndex: this.props.data.selectedIndex,
      options: this.props.data.plans.map(function (plan) {
        return {
          text: plan.name + '  -  ' + plan.displayPrice,
          value: plan.slug
        };
      })
    };
  },

  getSelectionAttrData: function () {
    return {
      selectedIndex: this.props.data.selectedIndex,
      info: this.props.data.plans,
      headline_features: this.props.data.headline_features
    };
  },

  render: function() {
    var self = this;

    if (_.isEmpty(this.props.data)) {
      return (
        <div></div>
      );
    } else {
      return (
        <div>
          <AddonModalTop data={this.props.data}/>
          <ModalSelect onChange={this.onPlanChange} data={this.formatSelectData()} ref={function(ref){ self.planSelectComp = ref; }}/>
          <ModalSelectionAttributes data={this.getSelectionAttrData()} ref={function(ref){ self.planDescription = ref; }} />
        </div>
      );
    }
  }
});