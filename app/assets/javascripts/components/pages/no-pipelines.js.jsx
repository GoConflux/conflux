var NoPipelines = React.createClass({
  
  onNewPipelineClick: function () {
    React.modal.show('pipeline:create', {
      team_uuid: this.props.team_uuid
    });
  },

  render: function() {
    return (
      <div id="noPipelinesView">
        <div className="message">Your team currently doesn't have any pipelines.</div>
        <div onClick={this.onNewPipelineClick} className="new-pipeline-btn">New Pipeline&nbsp;&nbsp;<span className="plus">+</span></div>
      </div>
    );
  }
});