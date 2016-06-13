var Addon = React.createClass({

  setTaglineRef: function (ref) {
    this.tagline = ref;
  },

  componentDidMount: function () {
    $(this.tagline).dotdotdot();
  },

  render: function() {
    return (
      <a href={this.props.data.link} className="addon">
        <img src={this.props.data.icon} className="addon-icon"/>
        <div className="addon-name">{this.props.data.name}</div>
        <div className="addon-tagline" ref={this.setTaglineRef}>{this.props.data.tagline}</div>
      </a>
    );
  }
});