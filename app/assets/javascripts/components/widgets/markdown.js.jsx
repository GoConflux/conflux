var Markdown = React.createClass({

  formatContent: function () {
    return this.props.content;
  },

  render: function() {
    return (
      <div className="markdown">{this.formatContent()}</div>
    );
  }
});