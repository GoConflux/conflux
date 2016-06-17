var CategoryAddons = React.createClass({

  getInitialState: function () {
    return {
      addons: (this.props.data || {}).addons || []
    };
  },

  getCategories: function () {
    return this.state.addons.map(function (group) {
      var category = group[0];
      var addons = group[1];

      return <div className="category" data-category={group[0].toLowerCase()}><div className="category-name">{category}</div><CategoryAddonsGrid data={addons} /></div>;
    });
  },

  render: function() {
    return (
      <div id="addons">{this.getCategories()}</div>
    );
  }
});