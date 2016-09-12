var EditableMarkdown = React.createClass({

  getInitialState: function () {
    return {
      preview: false,
      content: this.props.data.defaultValue
    }
  },

  setEditableMarkdownRef: function (ref) {
    this.editableMarkdown = ref;
  },

  setEditorRef: function (ref) {
    this.editor = ref;
    $(this.editor).autoGrow();
  },

  getContent: function () {
    if (this.state.preview) {
      return <div className="markdown-preview-container"><Markdown content={this.state.content} /></div>;
    } else {
      return <div className="markdown-editor-container"><textarea className="markdown-editor" defaultValue={this.state.content} ref={this.setEditorRef} onKeyUp={this.onKeyUp}></textarea></div>;
    }
  },

  onKeyUp: function () {
    $(this.editableMarkdown).removeClass('invalid');
  },

  toggleMarkdownPreview: function () {
    this.state.preview ? this.editMarkdown() : this.previewMarkdown();
  },

  editMarkdown: function () {
    $('.preview-markdown-icon').removeClass('preview');
    this.setState({ preview: !this.state.preview, content: this.cachedMarkdown });
  },

  previewMarkdown: function () {
    var self = this;
    $('.preview-markdown-icon').addClass('preview');
    this.cachedMarkdown = $(this.editor).val().trim();

    React.post('/addons/md_preview', { content: this.cachedMarkdown }, {
      success: function (data) {
        self.setState({ preview: !self.state.preview, content: data.content });
      }
    });
  },

  showInvalid: function () {
    $(this.editableMarkdown).addClass('invalid');
  },

  serialize: function (cb) {
    var valid = true;
    var value = this.state.preview ? this.cachedMarkdown : $(this.editor).val().trim();

    if (this.props.required && _.isEmpty(value)) {
      valid = false;
      this.showInvalid();
    }

    var data = { valid: valid, value: value };

    if (!cb) {
      return data;
    }

    cb(data);
  },
  
  render: function() {
    return (
      <div className="editable-markdown" ref={this.setEditableMarkdownRef}>{this.getContent()}</div>
    );
  }
});