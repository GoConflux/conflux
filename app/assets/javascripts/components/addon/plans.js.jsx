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

      if (i == self.state.selected) {
        classes += ' selected';
      }

      return <li className={classes} data-plan-index={i} onClick={self.props.onPlanSelected}><div className="name">{plan.name}</div><div className="price">{self.formatPrice(plan.price)}</div></li>;
    });
  },

  formatPrice: function (price) {
    // if price has 0 cents, just use integer value. Otherwise, show cents.
    var displayPrice = (parseInt(price) == parseFloat(price)) ? parseInt(price) : parseFloat(price).toFixed(2);
    return '$' + displayPrice + '/mo';
  },

  getPlansListClasses: function () {
    var classes = 'plans-list';

    if (!this.props.writeAccess) {
      classes += ' no-write';
    }

    return classes;
  },

  getSubsectionTitle: function () {
    return this.props.hideSubsectionTitle ? null : <div className="app-addon-subsection-title">Plans</div>;
  },

  render: function() {
    return (
      <div>
        {this.getSubsectionTitle()}
        <ul className={this.getPlansListClasses()}>{this.formatPlans()}</ul>
      </div>
    );
  }
});