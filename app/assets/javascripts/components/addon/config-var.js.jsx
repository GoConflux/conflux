var ConfigVar = React.createClass({

  setDescriptionRef: function (ref) {
    this.newKeyDescription = ref;
  },

  onClickEdit: function () {
    React.modal.show('key:update', {
      name: this.props.data.name,
      value: this.props.data.value,
      description: this.props.data.description
    }, {
      onConfirm: this.applyEdit
    });
  },

  applyEdit: function (data) {
    var self = this;

    React.put('/keys', {
      name: data.name,
      value: data.value,
      description: data.description,
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

  description: function () {
    return this.props.data.description || 'No Description';d
  },

  onNewKeyFocus: function () {
    this.showDescription();
  },

  onNewKeyBlur: function () {
    var self = this;

    setTimeout(function () {
      if (!$(self.keyName).is(':focus') &&
        !$(self.keyValue).is(':focus') &&
        !$(self.newKeyDescription).is(':focus') &&
        _.isEmpty($(self.keyName).val().trim()) &&
        _.isEmpty($(self.keyValue).val().trim())) {
        self.hideDescription();
      }
    }, 5);
  },

  setKeyNameRef: function (ref) {
    this.keyName = ref;
  },

  setKeyValueRef: function (ref) {
    this.keyValue = ref;
  },

  showDescription: function () {
    var $description = $(this.newKeyDescription);
    $description.show();

    setTimeout(function () {
      $description.addClass('in');
    }, 5);
  },

  hideDescription: function () {
    var $description = $(this.newKeyDescription);
    $description.removeClass('in');

    setTimeout(function () {
      $description.hide();
    }, 150);
  },

  getEditIcon: function () {
    if (!this.props.writeAccess) {
      return;
    }

    return <i onClick={this.onClickEdit} className="fa fa-pencil edit-icon"></i>;
  },

  getRemoveIcon: function () {
    if (!this.props.writeAccess) {
      return;
    }

    return <i onClick={this.onClickRemove} className="fa fa-times remove-key-icon"></i>;
  },

  render: function() {
    if (this.props.data.isNew) {
      return (
        <div key={Math.random()} className="relative">
          <input onFocus={this.onNewKeyFocus} onBlur={this.onNewKeyBlur} ref={this.setKeyNameRef} type="text" className="key-name-input config-var-input new" placeholder="KEY"/>
          <input onFocus={this.onNewKeyFocus} onBlur={this.onNewKeyBlur} ref={this.setKeyValueRef} type="text" className="key-val-input config-var-input" placeholder="VALUE"/>
          <input onBlur={this.onNewKeyBlur} className="new-config-description config-var-input" type="text" placeholder="Description" ref={this.setDescriptionRef} />
          <a href="javascript:void(0)" onClick={this.props.onAddNewKey} className="add-new-key-btn">Add</a>
        </div>
      );
    } else {
      return (
        <div key={Math.random()}>
          <i className="fa fa-info-circle key-info-icon" data-toggle="tooltip" data-placement="left" title={this.description()}></i>
          <input type="text" className="key-name-input config-var-input" placeholder="KEY" value={this.props.data.name} disabled="disabled"/>
          <input type="text" className="key-val-input config-var-input" placeholder="VALUE" value={this.props.data.value} disabled="disabled"/>
          {this.getEditIcon()}
          {this.getRemoveIcon()}
        </div>
      );
    }
  }
});