var ConfigVar = React.createClass({

  onClickEdit: function () {
    React.modal.show('key:update', {
      name: this.props.data.name,
      value: this.props.data.value
    }, {
      onConfirm: this.applyEdit
    });
  },

  applyEdit: function (data) {
    var self = this;

    React.put('/keys', {
      name: data.name,
      value: data.value,
      key_uuid: this.props.data.key_uuid
    }, {
      success: function (keys) {
        React.modal.hide();
        self.props.onUpdateKeys(keys);
      }
    });
  },

  onClickRemove: function () {
    React.modal.show('key:delete', {
      name: this.props.data.name
    }, {
      onConfirm: this.applyRemoval
    });
  },

  applyRemoval: function () {
    var self = this;

    React.delete('/keys', {
      key_uuid: this.props.data.key_uuid
    }, {
      success: function (keys) {
        React.modal.hide();
        self.props.onUpdateKeys(keys);
      }
    });
  },

  render: function() {
    if (this.props.data.isNew) {
      return (
        <div>
          <input type="text" className="key-name-input config-var-input new" placeholder="KEY"/>
          <input type="text" className="key-val-input config-var-input" placeholder="VALUE"/>
          <a href="javascript:void(0)" onClick={this.props.onAddNewKey} className="add-new-key-btn">Add</a>
        </div>
      );
    } else {
      return (
        <div>
          <i className="fa fa-info-circle key-info-icon"></i>
          <input type="text" className="key-name-input config-var-input" placeholder="KEY" value={this.props.data.name} disabled="disabled"/>
          <input type="text" className="key-val-input config-var-input" placeholder="VALUE" value={this.props.data.value} disabled="disabled"/>
          <i onClick={this.onClickEdit} className="fa fa-pencil edit-icon"></i>
          <i onClick={this.onClickRemove} className="fa fa-times remove-key-icon"></i>
        </div>
      );
    }
  }
});