var FormSelect = React.createClass({

  setSelectRef: function (ref) {
    this.select = ref;
  },

  getSelectOptions: function () {
    return this.props.data.options.map(function (data) {
      return <option value={data.value}>{data.text}</option>;
    });
  },

  // always assume it's valid for now since it currently always has a default value
  serialize: function (cb) {
    var data = { valid: true, value: $(this.select).val() };

    if (!cb) {
      return data;
    }

    cb(data);
  },

  render: function() {
    return (
      <div className="form-select-container">
        <select className="form-select" defaultValue={this.props.data.defaultValue} ref={this.setSelectRef}>{this.getSelectOptions()}</select>
      </div>
    );
  }
});