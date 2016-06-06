var Plans = React.createClass({

  getInitialState: function () {
    return {
      selected: (this.props.data || {}).selected || 0
    };
  },

  formatPlans: function () {
    var self = this;

    return this.props.data.plans.map(function (plan, i) {
      var classes = 'plan-option';
      classes += (i == self.state.selected) ? ' selected' : '';
      return <li className={classes} data-plan-index={i} onClick={self.props.onPlanSelected}><div className="name">{plan.name}</div><div className="price">{plan.displayPrice}</div></li>;
    });
  },

  render: function() {
    return (
      <div>
        <div className="app-addon-subsection-title">Plans</div>
        <ul className="plans-list">{this.formatPlans()}</ul>
      </div>
    );
  }
});