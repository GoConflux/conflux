var FormSection = React.createClass({

  setCharCounterRef: function (ref) {
    this.charCounter = ref;
  },

  getFormComponent: function () {
    var comp;

    switch (this.props.compData.type) {
      case 'input':
        comp = <FormInput required={this.props.required} data={this.props.compData} onKeyUp={this.onInputKeyUp} />;
        break;
      case 'select':
        comp = <FormSelect required={this.props.required} data={this.props.compData} />;
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

  render: function() {
    return (
      <div className="form-section">
        <div className="form-section-label">
          {this.getLabel()}
          {this.getCharCounter()}
          {this.getSectionDescription()}
        </div>
        {this.getFormComponent()}
      </div>
    );
  }
});