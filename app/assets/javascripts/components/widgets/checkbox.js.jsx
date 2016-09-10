var Checkbox = React.createClass({

  setCheckboxWrapRef: function (ref) {
    this.checkboxWrap = ref;
  },

  getLabel: function () {
    if (!this.props.label) {
      return;
    }

    return <span className="checkbox-label">{this.props.label}</span>;
  },

  customClasses: function () {
    var classes = 'checkbox-wrap';

    if (this.props.customClasses) {
      classes += (' ' + this.props.customClasses.join(' '));
    }

    return classes;
  },

  onClick: function (e) {
    $(this.checkboxWrap).toggleClass('checked');

    if (this.props.clickHandler) {
      this.props.clickHandler(e, $(this.checkboxWrap).hasClass('checked'));
    }
  },

  render: function() {
    return (
      <div className={this.customClasses()} onClick={this.onClick} ref={this.setCheckboxWrapRef}><div className="checkbox"></div>{this.getLabel()}</div>
    );
  }
});