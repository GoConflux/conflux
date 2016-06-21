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
      'Read/Write access to Non-production apps': 'yes',
      'Read access to Production apps': 'no',
      'Write access to Production apps': 'no',
      'Can invite new team members': 'no'
    },
    {
      'Read/Write access to Non-production apps': 'yes',
      'Read access to Production apps': 'yes',
      'Write access to Production apps': 'no',
      'Can invite new team members': 'no'
    },
    {
      'Read/Write access to Non-production apps': 'yes',
      'Read access to Production apps': 'yes',
      'Write access to Production apps': 'yes',
      'Can invite new team members': 'yes'
    }
  ],

  headlineFeatures: [
    'Read/Write access to Non-production apps',
    'Read access to Production apps',
    'Write access to Production apps',
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
    if (!$(this.input).val().trim()) {
      $(this.inputContainer).addClass('invalid');
      return false;
    }

    return true;
  },

  serialize: function () {
    return {
      team_uuid: this.props.data.team_uuid,
      emails: [$(this.input).val().trim()], // backend still supports multiple emails, comma-delimited. Limiting to 1 for now.
      role: this.role.getValue()
    };
  },

  onHide: function () {
    $(this.input).val('');

    if (this.props.isNew) {
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

  render: function() {
    return (
      <div className="invite-users-modal">
        <div className="modal-name-input-container" ref={this.setInputContainerRef}>
          <input type="text" className="modal-name-input" placeholder="Email" onKeyUp={this.onKeyUp} ref={this.setInputRef} />
        </div>
        <ModalSelect data={this.formatSelectData()} ref={this.setRoleRef} onChange={this.onRoleChange} />
        <ModalSelectionAttributes data={this.getSelectionAttrData()} ref={this.setRoleDescriptionRef} />
      </div>
    );
  }

});