var DeletePipelineModal = React.createClass({

  hideOnConfirm: true,

  render: function() {
    return (
      <div className="delete-pipeline-modal-container">
        <div className="delete-pipeline-modal-question">Are you sure you want to delete this pipeline?</div>
      </div>
    );
  }
});