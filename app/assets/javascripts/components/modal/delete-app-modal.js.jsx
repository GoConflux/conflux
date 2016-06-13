var DeleteAppModal = React.createClass({

  hideOnConfirm: true,

  render: function() {
    return (
      <div className="delete-app-modal-container">
        <div className="delete-app-modal-question">Are you sure you want to delete this app?</div>
      </div>
    );
  }
});