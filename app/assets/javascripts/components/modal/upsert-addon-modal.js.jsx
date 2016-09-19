var UpsertAddonModal = React.createClass({

  setScopeSelectRef: function (ref) {
    this.scopeSelect = ref;
  },

  serialize: function () {
    return this.props.isNew ? {
      app_uuid: this.props.data.app_uuid,
      addon_uuid: this.props.data.addon_uuid,
      plan: this.planSelectComp.getValue(),
      scope: Number(this.scopeSelect.getValue())
    } : {
      plan: this.planSelectComp.getValue()
    };
  },

  onHide: function () {
    if (this.props.isNew) {
      this.forceSelectPlan(0);
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
      this.disableConfirmBtnForPlan();
      mixpanel.track('Paid plan selected', { addon: this.props.data.name, plan: planInfo.slug });
    } else {
      $('.modal-action-btn.confirm').removeClass('plan-na');
      $('.modal-action-btn.confirm').hasClass('scope-na') ? this.disableConfirmBtnForScope() : this.enableConfirmBtn();
    }
  },

  disableConfirmBtnForPlan: function () {
    React.modal.disableConfirm();
    var $btn = $('.modal-action-btn.confirm');

    $btn.html('<span><i class="fa fa-lock lock-icon"></i>Plan not currently available</span>');

    if (!$btn.hasClass('plan-na')) {
      $btn.addClass('plan-na');
    }
  },

  disableConfirmBtnForScope: function () {
    React.modal.disableConfirm();
    var $btn = $('.modal-action-btn.confirm');

    $btn.html('<span><i class="fa fa-lock lock-icon"></i>Service already exists for this scope</span>');

    if (!$btn.hasClass('scope-na')) {
      $btn.addClass('scope-na');
    }
  },

  enableConfirmBtn: function () {
    React.modal.enableConfirm();
    $('.modal-action-btn.confirm').html((this.props.isNew ? 'Provision' : 'Update')).removeClass('plan-na scope-na');
  },

  formatSelectData: function () {
    return {
      title: 'Plan',
      selectedIndex: this.props.data.selectedIndex,
      options: this.props.data.plans.map(function (plan) {
        var displayPrice = null;

        if (parseInt(plan.price) == 0 && parseInt(plan.price) == Math.ceil(parseFloat(plan.price))) {
          displayPrice = 'Free';
        } else {
          displayPrice = '$' + plan.price;
        }

        return {
          text: plan.name + '  -  ' + displayPrice,
          value: plan.slug
        };
      })
    };
  },

  getSelectionAttrData: function () {
    return {
      selectedIndex: this.props.data.selectedIndex,
      plans: this.props.data.plans,
      headline_features: this.props.data.headline_features
    };
  },

  formatScopeData: function () {
    return {
      title: 'Scope',
      selectedIndex: 0,
      options: [
        {
          text: 'Shared',
          value: '0'
        },
        {
          text: 'Personal',
          value: '1'
        }
      ]
    };
  },

  // scope is either '0' or '1'
  onScopeChange: function (scope) {
    if (_.contains(this.props.data.addonsMap[scope], this.props.data.addon_uuid)) {
      this.disableConfirmBtnForScope();
    } else {
      $('.modal-action-btn.confirm').removeClass('scope-na');
      $('.modal-action-btn.confirm').hasClass('plan-na') ? this.disableConfirmBtnForPlan() : this.enableConfirmBtn();
    }
  },

  getScopeSelect: function () {
    return this.props.isNew ?
      <ModalSelect customClasses={'scope-select'} onChange={this.onScopeChange} data={this.formatScopeData()} ref={this.setScopeSelectRef} /> :
      null;
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
          {this.getScopeSelect()}
          <ModalSelect onChange={this.onPlanChange} data={this.formatSelectData()} ref={function(ref){ self.planSelectComp = ref; }}/>
          <ModalSelectionAttributes data={this.getSelectionAttrData()} ref={function(ref){ self.planDescription = ref; }} />
        </div>
      );
    }
  }
});