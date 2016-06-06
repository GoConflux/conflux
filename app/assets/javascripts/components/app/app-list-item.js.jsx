var AppListItem = React.createClass({
  render: function() {
    return (
      <div className="app-list-item">
        <i className="fa fa-circle app-icon"></i>
        <div className="app-name">{this.props.data.name}</div>
      </div>
    );
  }
});