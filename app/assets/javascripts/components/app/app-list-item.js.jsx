var AppListItem = React.createClass({

  setCloneIconRef: function (ref) {
    this.cloneIcon = ref;
  },

  componentDidMount: function () {
    $(this.cloneIcon).tooltip();

    this.cloneIcon.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  },

  render: function() {
    return (
      <div className="app-list-item">
        <img src="http://confluxapp.s3-website-us-west-1.amazonaws.com/images/app-gray.svg" className="app-icon"/>
        <div className="app-name">{this.props.data.name}</div>
        <i className="fa fa-clone clone-icon" data-toggle="tooltip" data-placement="top" title="Cloning bundles coming soon." ref={this.setCloneIconRef}></i>
      </div>
    );
  }
});