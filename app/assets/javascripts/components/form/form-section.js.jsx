var FormSection = React.createClass({

  getFormComponent: function () {
    var comp;

    switch (this.props.compData.type) {
      case 'input':
        comp = <FormInput required={this.props.required} data={this.props.compData} />;
        break;
    }

    return comp;
  },

  getLabel: function () {
    if (this.props.required) {
      return <span>{this.props.label} <span className="required">(Required)</span></span>;
    } else {
      return this.props.label;
    }
  },

  render: function() {
    return (
      <div className="form-section">
        <div className="form-section-label">{this.getLabel()}</div>
        {this.getFormComponent()}
      </div>
    );
  }
});