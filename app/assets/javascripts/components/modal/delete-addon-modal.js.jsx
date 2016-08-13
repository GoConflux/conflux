var DeleteAddonModal = React.createClass({

  render: function() {
    return (
      <div className="delete-addon-modal-container">
        <div className="delete-addon-modal-question">Are you sure you want to remove <span className="addon-to-remove">{this.props.data.name}</span> as a service?</div>
      </div>
    );
  }
});