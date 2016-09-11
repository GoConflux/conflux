var DollarInput = React.createClass({

  setInputRef: function (ref) {
    var self = this;
    this.input = ref;

    $(this.input).autoNumeric('init', {
      aSep: '',
      mDec: '2',
      vMin: '0.00'
    });
  },

  getValue: function () {
    return '$' + $(this.input).val();
  },

  getClasses: function () {
    var classes = this.props.classes;

    if (Array.isArray(classes)) {
      classes = classes.join(' ');
    }

    return classes;
  },

  render: function() {
    return (
      <div className="dollar-input-container">
        <input type="text" className={this.getClasses()} placeholder={this.props.placeholder} defaultValue={this.props.val} onKeyUp={this.props.onKeyUp} ref={this.setInputRef} />
      </div>
    );
  }
});