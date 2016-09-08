var EditableFeatures = React.createClass({

  getInitialState: function () {
    return {
      features: this.props.data.features,
      plans: Object.keys(((this.props.data.features || [])[0] || {}).values || {})
    };
  },

  getFeatures: function () {
    var self = this;

    return this.state.features.map(function (feature) {
      return <EditableFeature data={feature} plans={self.state.plans} />
    });
  },

  addNewFeature: function () {
    
  },

  render: function() {
    return (
      <div className="editable-features">
        {this.getFeatures()}
        <div className="new-row-btn" onClick={this.addNewFeature}>New Feature</div>
      </div>
    );
  }
});