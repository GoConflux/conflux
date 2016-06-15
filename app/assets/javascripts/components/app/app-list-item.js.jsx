var AppListItem = React.createClass({
  render: function() {
    return (
      <div className="app-list-item">
        <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/app-green.svg" className="app-icon"/>
        <div className="app-name">{this.props.data.name}</div>
      </div>
    );
  }
});