var SuggestAddonModal = React.createClass({

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
    React.post('/addons/suggest', { addon: $(this.input).val() }, {
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
      <div className="suggest-addon-modal">
        <div className="modal-name-input-container" ref={this.setInputContainerRef}>
          <input type="text" className="modal-name-input" placeholder="Service name" onKeyUp={this.onKeyUp} ref={this.setInputRef} />
        </div>
      </div>
    );
  }

});