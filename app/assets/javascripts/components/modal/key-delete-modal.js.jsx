var KeyDeleteModal = React.createClass({

  render: function() {
    return (
      <div className="key-delete-modal-body">
        <div className="modal-question-text">Are you sure you want to remove the following config var?</div>
        <div className="config-var-to-remove">{this.props.data.name}</div>
      </div>
    );
  }
});