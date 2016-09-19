var Markdown = React.createClass({

  createMarkdown: function () {
    return { __html: this.props.content };
  },

  render: function() {
    return (
      <div className="markdown" dangerouslySetInnerHTML={this.createMarkdown()}></div>
    );
  }
});