var UpsertAppModal = React.createClass({

  tiers: function () {
    var tiers = ['Local Development', 'Cloud Development', 'Staging'];

    if (this.props.data.includeProd) {
      tiers.push('Production');
    }

    return tiers;
  },

  setNameInputRef: function (ref) {
    this.nameInput = ref;
  },

  onHide: function () {
    if (this.props.isNew) {
      this.nameInput.setValue('');
    }
  },

  onNameInputKeyUp: function (name) {
    var self = this;
    var originalName = this.props.data.defaultName;

    if (originalName && name === originalName) {
      this.nameInput.showValid();
      return;
    }

    var data = { name: name };

    if (this.props.data.appUUID) {
      data.app_uuid = this.props.data.appUUID;
    }

    React.get('/apps/name_available', data, {
      success: function (info) {
        info.available ? self.nameInput.showValid() : self.nameInput.showInvalid();
      }
    });
  },

  formatSelectData: function () {
    return {
      title: 'Tier',
      selectedIndex: this.props.data.selectedIndex,
      options: this.tiers().map(function (tier) { return { text: tier, value: tier }; })
    };
  },

  validate: function () {
    var nameExists = !!this.nameInput.getValue();
    
    if (!nameExists) {
      this.nameInput.showInvalid();
      return false;
    }

    if (!this.nameInput.isAvailable()) {
      return false;
    }

    return true;
  },

  serialize: function () {
    return this.props.isNew ? {
      name: this.nameInput.getValue(),
      tier_uuid: this.props.data.tierUUIDs[this.getSelectedTierStage()]
    } : {
      name: this.nameInput.getValue(),
      stage: this.getSelectedTierStage()
    };
  },

  getSelectedTierStage: function () {
    return this.tiers().indexOf(this.tierSelectComp.getValue());
  },

  render: function() {
    var self = this;

    return (
      <div className="create-app-modal">
        <ModalNameInput placeholder={'Bundle name'} defaultName={this.props.data.defaultName} onKeyUp={this.onNameInputKeyUp} ref={this.setNameInputRef} />
        <ModalSelect data={this.formatSelectData()} ref={function(ref){ self.tierSelectComp = ref; }}/>
      </div>
    );
  }
});