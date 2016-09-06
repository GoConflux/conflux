var ActionRequiresAuthModal = React.createClass({

  onConfirm: function () {
    window.location = '/login';
  },

  render: function() {
    return (
      <div className="action-requires-auth-modal">
        <div className="message">{this.props.data.message}</div>
      </div>
    );
  }
});