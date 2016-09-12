var FormSection = React.createClass({

  setCharCounterRef: function (ref) {
    this.charCounter = ref;
  },

  setCompRef: function (ref) {
    this.comp = ref;
  },

  getFormComponent: function () {
    var comp;

    switch (this.props.compData.type) {
      case 'input':
        comp = <FormInput required={this.props.required} data={this.props.compData} onKeyUp={this.onInputKeyUp} ref={this.setCompRef} />;
        break;
      case 'select':
        comp = <FormSelect required={this.props.required} data={this.props.compData} ref={this.setCompRef} />;
        break;
      case 'markdown':
        comp = <EditableMarkdown required={this.props.required} data={this.props.compData} ref={this.setCompRef} />;
        break;
      case 'form-double-input':
        comp = <FormDoubleInput required={this.props.required} data={this.props.compData} onRemoveRow={this.props.onRemoveRow} onNewRow={this.props.onNewRow} onBlurFirstCol={this.props.onBlurFirstCol} ref={this.setCompRef} />;
        break;
      case 'editable-features':
        comp = <EditableFeatures required={this.props.required} data={this.props.compData} ref={this.setCompRef} />;
        break;
      case 'editable-api':
        comp = <EditableApi required={this.props.required} data={this.props.compData} ref={this.setCompRef} />;
        break;
      case 'editable-jobs':
        comp = <EditableJobs required={this.props.required} data={this.props.compData} ref={this.setCompRef} />;
        break;
      case 'icon':
        comp = <UploadIcon required={this.props.required} data={this.props.compData} ref={this.setCompRef} />;
        break;
    }

    return comp;
  },

  onInputKeyUp: function (val) {
    if (this.props.compData.maxLength) {
      $(this.charCounter).find('.count').html((val || '').length);
    }
  },

  getLabel: function () {
    if (this.props.required) {
      return <span>{this.props.label} <span className="required">(Required)</span></span>;
    } else {
      return this.props.label;
    }
  },

  getSectionDescription: function () {
    if (!this.props.description) {
      return;
    }

    return <div className="form-section-description">{this.props.description}</div>;
  },

  getCharCounter: function () {
    if (this.props.compData.type == 'input' && this.props.compData.maxLength) {
      return <div className="char-counter" ref={this.setCharCounterRef}><span className="count">{(this.props.compData.defaultValue || '').length}</span> / <span className="max">{this.props.compData.maxLength}</span></div>;
    } else {
      return;
    }
  },

  getMarkdownPreviewIcon: function () {
    if (this.props.compData.type == 'markdown') {
      return <i className="fa fa-eye preview-markdown-icon" onClick={this.toggleMarkdownPreview} data-toggle="tooltip" data-placement="top" title="Preview Markdown" data-delay='{"show":"500", "hide":"100"}' ref={this.enablePreviewIconTooltip}></i>;
    } else {
      return;
    }
  },

  enablePreviewIconTooltip: function (ref) {
    $(ref).tooltip();
  },

  toggleMarkdownPreview: function () {
    if (this.comp.toggleMarkdownPreview) {
      this.comp.toggleMarkdownPreview();
    }
  },

  serialize: function (cb) {
    this.comp.serialize(function (data) {
      cb(data);
    });
  },

  render: function() {
    return (
      <div className="form-section">
        <div className="form-section-label">
          {this.getLabel()}
          {this.getCharCounter()}
          {this.getMarkdownPreviewIcon()}
          {this.getSectionDescription()}
        </div>
        {this.getFormComponent()}
      </div>
    );
  }
});