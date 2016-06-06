var HorizontalSpinner = React.createClass({

  showSpinner: function () {
    $(this.spinner).show();
  },

  hideSpinner: function () {
    $(this.spinner).hide();
  },

  setSpinnerRef: function (ref) {
    this.spinner = ref;
  },

  render: function() {
    return (
      <div className="horiz-spinner" ref={this.setSpinnerRef}>
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    );
  }
});