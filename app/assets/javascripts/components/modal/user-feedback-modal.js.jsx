var UserFeedbackModal = React.createClass({

  setInputRef: function (ref) {
    this.input = ref;
  },

  setInputContainerRef: function (ref) {
    this.inputContainer = ref;
  },

  onConfirm: function () {
    var feedback = $(this.input).val();

    if (!feedback.trim()) {
      $(this.inputContainer).addClass('invalid');
      return;
    }

    React.post('/users/feedback', { feedback: feedback }, {
      success: function () {
        React.modal.hide();
      }
    });
  },

  onKeyUp: function () {
    $(this.inputContainer).removeClass('invalid');
  },

  render: function() {
    return (
      <div className="user-feedback-modal">
        <div className="modal-textarea-container" ref={this.setInputContainerRef}>
          <textarea className="modal-textarea" placeholder="Feedback, ideas, bugs, etc." onKeyUp={this.onKeyUp} ref={this.setInputRef} />
        </div>
      </div>
    );
  }

});