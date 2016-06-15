var UserFeedbackModal = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  setInputContainerRef: function (ref) {
    this.inputContainer = ref;
  },

  validate: function () {
    if (!$(this.input).val().trim()) {
      $(this.inputContainer).addClass('invalid');
      return false;
    }

    return true;
  },

  onConfirm: function () {
    React.post('/users/feedback', { feedback: $(this.input).val() }, {
      success: function () {
        React.modal.hide();
      }
    });
  },

  onHide: function () {
    $(this.input).val('');
  },

  onKeyUp: function () {
    $(this.inputContainer).removeClass('invalid');
  },

  render: function() {
    return (
      <div className="user-feedback-modal">
        <div className="modal-textarea-container" ref={this.setInputContainerRef}>
          <textarea className="modal-textarea" placeholder="Feedback, suggestions, bugs, etc." onKeyUp={this.onKeyUp} ref={this.setInputRef} />
        </div>
      </div>
    );
  }

});