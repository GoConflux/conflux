var DeleteAddonModal = React.createClass({

  hideOnConfirm: true,

  render: function() {
    return (
      <div className="delete-addon-modal-container">
        <div className="delete-addon-modal-question">Are you sure you want to remove <span className="addon-to-remove">{this.props.data.name}</span> as an add-on?</div>
      </div>
    );
  }
});