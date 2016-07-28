var UpsertTeamUserModal = React.createClass({

  roleSelectionData: [
    {
      text: 'Contributor - Limited',
      value: '0'
    },
    {
      text: 'Contributor',
      value: '1'
    },
    {
      text: 'Admin',
      value: '2'
    }
  ],

  // The order of these maps to the order of roleSelectionData[] above
  roleInfo: [
    {
      'Read/Write access to all Non-production bundles': 'yes',
      'Read access to Production bundles': 'no',
      'Write access to Production bundles': 'no',
      'Can invite new team members': 'no'
    },
    {
      'Read/Write access to all Non-production bundles': 'yes',
      'Read access to Production bundles': 'yes',
      'Write access to Production bundles': 'no',
      'Can invite new team members': 'no'
    },
    {
      'Read/Write access to all Non-production bundles': 'yes',
      'Read access to Production bundles': 'yes',
      'Write access to Production bundles': 'yes',
      'Can invite new team members': 'yes'
    }
  ],

  headlineFeatures: [
    'Read/Write access to all Non-production bundles',
    'Read access to Production bundles',
    'Write access to Production bundles',
    'Can invite new team members'
  ],

  setInputRef: function (ref) {
    this.input = ref;
  },

  setInputContainerRef: function (ref) {
    this.inputContainer = ref;
  },

  setRoleRef: function (ref) {
    this.role = ref;
  },

  setRoleDescriptionRef: function (ref) {
    this.roleDescription = ref;
  },

  validate: function () {
    if (this.props.isNew && !$(this.input).val().trim()) {
      $(this.inputContainer).addClass('invalid');
      return false;
    }

    return true;
  },

  getEmails: function () {
    return $(this.input).val().split(',').map(function (email) {
      return email.trim();
    });
  },

  serialize: function () {
    if (this.props.isNew) {
      return {
        team_uuid: this.props.data.team_uuid,
        emails: this.getEmails(), // backend still supports multiple emails, comma-delimited. Limiting to 1 for now.
        role: this.role.getValue()
      };
    } else {
      return {
        role: this.role.getValue()
      }
    }
  },

  onHide: function () {
    if (this.props.isNew) {
      $(this.input).val('');
      this.forceSelectRole(0);
    }
  },

  forceSelectRole: function (index) {
    this.role.setValue(index.toString());

    this.roleDescription.setState({
      selection: index
    });
  },

  onKeyUp: function () {
    $(this.inputContainer).removeClass('invalid');
  },

  formatSelectData: function () {
    return {
      title: 'Role',
      selectedIndex: this.props.data.selectedIndex,
      options: this.roleSelectionData
    };
  },

  onRoleChange: function (val) {
    this.roleDescription.updateAttrs(Number(val));
  },

  getSelectionAttrData: function () {
    return {
      selectedIndex: this.props.data.selectedIndex || 0,
      info: this.roleInfo,
      headline_features: this.headlineFeatures
    };
  },

  getEmail: function () {
    if (this.props.isNew) {
      return <input type="text" className="modal-name-input" placeholder="Email" onKeyUp={this.onKeyUp} ref={this.setInputRef} />;
    } else {
      return <div className="static-user-email">{this.props.data.email}</div>;
    }
  },

  render: function() {
    var modalNameInputContainerClasses = 'modal-name-input-container';

    if (!this.props.isNew) {
      modalNameInputContainerClasses += ' no-side-padding';
    }

    return (
      <div className="invite-users-modal">
        <div className={modalNameInputContainerClasses} ref={this.setInputContainerRef}>
          {this.getEmail()}
        </div>
        <ModalSelect data={this.formatSelectData()} ref={this.setRoleRef} onChange={this.onRoleChange} />
        <ModalSelectionAttributes data={this.getSelectionAttrData()} ref={this.setRoleDescriptionRef} />
      </div>
    );
  }

});