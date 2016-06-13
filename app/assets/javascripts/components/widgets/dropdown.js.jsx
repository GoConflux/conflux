var Dropdown = React.createClass({

  toggleVisibility: function () {
    $('#' + this.props.customID).toggle();
  },

  hideDropdown: function () {
    $('#' + this.props.customID).hide();
  },

  getDropdownOptions: function () {
    var self = this;

    return this.props.data.map(function (option) {
      return <li className="dropdown-option" onClick={option.onClick}><div className="text">{option.text}</div><i className={option.iconClasses}></i></li>
    });
  },

  render: function() {
    return (
      <div className="dropdown-container" id={this.props.customID}>
        <ul className="dropdown-options">{this.getDropdownOptions()}</ul>
      </div>
    );
  }
});