var ModalNameInput = React.createClass({

  timeout: null,

  setInputRef: function (ref) {
    this.input = ref;
  },

  componentDidMount: function () {
    try {
      this.addKeyUpListener();

      if (!this.props.preventBlurListener) {
        this.addBlurListener();
      }
    } catch (e) {}
  },

  addKeyUpListener: function () {
    var self = this;

    $(this.input).keyup(function () {
      var input = this;

      self.hideCheckingAvailability();

      // if timeout already exists, clear it
      if (self.timeout !== null) {
        clearTimeout(self.timeout);
      }

      if (_.isEmpty($(this).val())) {
        return;
      }

      // create new timeout for 250ms from now
      self.timeout = setTimeout(function () {
        self.props.onKeyUp($(input).val());
      }, 250);
    })
  },

  addBlurListener: function () {
    var self = this;

    $(this.input).blur(function () {
      self.hideCheckingAvailability();
    });
  },

  empty: function () {
    $(this.input).val('');
  },

  getValue: function () {
    return $(this.input).val().trim();
  },

  setValue: function (val) {
    $(this.input).val(val);
  },

  hideCheckingAvailability: function () {
    $('.modal-name-input-container').removeClass('invalid valid');
    $('.name-available-indicator-icon').hide();
  },

  showValid: function () {
    $('.modal-name-input-container').removeClass('invalid').addClass('valid');
    $('.available').show();
    $('.not-available').hide();
  },

  showInvalid: function () {
    $('.modal-name-input-container').removeClass('valid').addClass('invalid');
    $('.available').hide();
    $('.not-available').show();
  },

  isAvailable: function () {
    return !$('.modal-name-input-container').hasClass('invalid');
  },

  getDefaultValue: function () {
    return this.props.defaultName || '';
  },

  render: function() {
    try {
      this.hideCheckingAvailability();
    } catch (e) {}

    return (
      <div className="modal-name-input-container">
        <i className="fa fa-check-circle name-available-indicator-icon available"></i>
        <i className="fa fa-ban name-available-indicator-icon not-available"></i>
        <input type="text" className="modal-name-input" placeholder={this.props.placeholder} defaultValue={this.getDefaultValue()} ref={this.setInputRef} />
      </div>
    );
  }
});