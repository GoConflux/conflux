var ModalSelect = React.createClass({

  getSelectOptions: function () {
    return this.props.data.options.map(function (data, i) {
      return data.disabled ?
        <option value={data.value} disabled>{data.text}</option> :
        <option value={data.value}>{data.text}</option>;
    });
  },

  setSelectRef: function (ref) {
    this.select = ref;
  },

  getDefault: function () {
    var data = this.props.data;

    if (!_.isNumber(data.selectedIndex)) {
      return;
    }

    return data.options[data.selectedIndex].value;
  },

  getValue: function () {
    return $(this.select).val();
  },

  setValue: function (val) {
    $(this.select).val(val);
  },

  onSelectChange: function () {
    if (this.props.onChange) {
      this.props.onChange(this.getValue());
    }
  },

  render: function() {
    return (
      <div className="modal-select-container">
        <div className="select-title">{this.props.data.title}</div>
        <select key={Date.now()} ref={this.setSelectRef} className="conflux-select" defaultValue={this.getDefault()} onChange={this.onSelectChange}>{this.getSelectOptions()}</select>
      </div>
    );
  }
});