var ForgotPasswordModal = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  setInputContainerRef: function (ref) {
    this.inputContainer = ref;
  },

  validate: function () {
    if (!this.email()) {
      $(this.inputContainer).addClass('invalid');
      return false;
    }

    return true;
  },

  email: function () {
    return $(this.input).val().trim();
  },

  onConfirm: function () {
    React.post('/forgot_password', { email: this.email() }, {
      success: function () {
        React.modal.hide();
      }
    });
  },

  onKeyUp: function () {
    $(this.inputContainer).removeClass('invalid');
  },

  onHide: function () {
    $(this.input).val('');
  },

  render: function() {
    return (
      <div className="forgot-password-modal">
        <div className="modal-name-input-container" ref={this.setInputContainerRef}>
          <input type="text" className="modal-name-input" placeholder="Your email" onKeyUp={this.onKeyUp} ref={this.setInputRef} />
        </div>
      </div>
    );
  }

});