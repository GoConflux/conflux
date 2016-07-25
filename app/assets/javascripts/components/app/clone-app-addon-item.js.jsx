var CloneAppAddonItem = React.createClass({

  include: true,

  setItemRef: function (ref) {
    this.item = ref;
  },

  setPlanSelectRef: function (ref) {
    this.planSelect = ref;
  },

  setExcludeAddonRef: function (ref) {
    this.excludeAddon = ref;
  },

  formatSelectData: function () {
    return {
      selectedIndex: this.props.data.selected_plan_index,
      options: this.props.data.plans.map(function (plan) {
        return {
          text: plan.name + '  -  ' + plan.displayPrice,
          value: plan.slug,
          disabled: plan.disabled == 'true'
        };
      })
    };
  },

  onExcludeAddon: function () {
    if ($(this.item).hasClass('exclude')) {
      $(this.item).removeClass('exclude');
      $(this.excludeAddon).html('<span>&times;</span>');
      this.include = true;
    } else {
      $(this.item).addClass('exclude');
      $(this.excludeAddon).html('+');
      this.include = false;
    }
  },

  isIncluded: function () {
    return this.include;
  },

  serialize: function () {
    return {
      addon_uuid: this.props.data.addon_uuid,
      plan: this.planSelect.getValue()
    }
  },

  render: function() {
    return (
      <div className="clone-app-addon-item" ref={this.setItemRef}>
        <img className="icon" src={this.props.data.icon} />
        <div className="name">{this.props.data.name}</div>
        <div className="exclude-addon" ref={this.setExcludeAddonRef} onClick={this.onExcludeAddon}><span>&times;</span></div>
        <div className="plan-select-container">
          <ModalSelect data={this.formatSelectData()} preventDisabledOptions={true} ref={this.setPlanSelectRef}/>
        </div>
      </div>
    );
  }
});