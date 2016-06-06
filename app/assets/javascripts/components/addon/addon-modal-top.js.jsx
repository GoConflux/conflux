var AddonModalTop = React.createClass({
  render: function() {
    return (
      <div className="addon-modal-top-container">
        <img src={this.props.data.icon} className="modal-top-addon-icon"/>
        <div className="modal-top-addon-name">{this.props.data.name}</div>
      </div>
    );
  }
});