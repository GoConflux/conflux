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
    }
  },

  forceSelectPlan: function (index) {
    this.planSelectComp.setValue(this.props.data.plans[index].slug);

    this.planDescription.setState({
      selection: index
    });
  },

  onPlanChange: function (val) {
    this.planDescription.updateAttrs(_.findIndex(this.props.data.plans, function(plan){ return plan.slug == val; }));
  },

  formatSelectData: function () {
    return {
      title: 'Plan',
      selectedIndex: this.props.data.selectedIndex,
      options: this.props.data.plans.map(function (plan) {
        return {
          text: plan.name + '  -  ' + plan.displayPrice,
          value: plan.slug,
          disabled: plan.disabled == 'true'
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