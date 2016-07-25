var CloneAppModal = React.createClass({

  addonsInfo: [],

  pushRefToList: function (ref) {
    this.addonsInfo.push(ref);
  },

  setNameInputRef: function (ref) {
    this.nameInput = ref;
  },

  setTierSelectRef: function (ref) {
    this.tierSelect = ref;
  },

  setSelectedTierRef: function (ref) {
    this.selectedTier = ref;
  },

  tiers: function () {
    var tiers = ['Local Development', 'Cloud Development', 'Staging'];

    if (this.props.data.includeProd) {
      tiers.push('Production');
    }

    return tiers;
  },

  onHide: function () {
    this.nameInput.setValue('');

    this.addonsInfo.forEach(function (item) {
      item.include();
    });
  },

  formatSelectData: function () {
    return {
      selectedIndex: this.props.data.sourceAppTierIndex,
      options: this.tiers().map(function (tier) { return { text: tier, value: tier }; })
    };
  },

  onNameInputKeyUp: function (name) {
    var self = this;

    React.get('/apps/name_available', { name: name }, {
      success: function (info) {
        info.available ? self.nameInput.showValid() : self.nameInput.showInvalid();
      }
    });
  },

  onTierChange: function (tier) {
    $(this.selectedTier).html(tier);
  },

  getAddons: function () {
    var self = this;

    var items = [<div className="clone-app-addon-header"><div className="cloned-app-name"><ModalNameInput placeholder={'New bundle name'} onKeyUp={this.onNameInputKeyUp} preventBlurListener={true} ref={this.setNameInputRef} /></div><div className="tier-select-container"><ModalSelect data={this.formatSelectData()} onChange={this.onTierChange} ref={this.setTierSelectRef}/></div><div className="selected-tier" ref={this.setSelectedTierRef}>{this.tiers()[this.props.data.sourceAppTierIndex]}</div></div>];

    this.props.data.addons.forEach(function (data) {
      items.push(<CloneAppAddonItem data={data} ref={self.pushRefToList} />);
    });

    return items;
  },

  serializeAddonData: function () {
    var data = [];

    this.addonsInfo.forEach(function (addonItem) {
      if (addonItem.isIncluded()) {
        data.push(addonItem.serialize());
      }
    });

    return data;
  },

  validate: function () {
    var valid = !_.isEmpty(this.nameInput.getValue()) && this.nameInput.isAvailable();

    if (!valid) {
      this.nameInput.showInvalid();
    }

    return valid;
  },

  onConfirm: function () {
    var data = this.serialize();

    React.post('/apps/clone', data, { success: function (info) {
      if (info.url) {
        window.location = info.url;
      }
    }});
  },

  serialize: function () {
    return {
      name: this.nameInput.getValue(),
      tierStage: this.tiers().indexOf(this.tierSelect.getValue()),
      addons: this.serializeAddonData(),
      pipeline_uuid: this.props.data.pipeline_uuid
    }
  },

  render: function() {
    return (
      <div className="clone-app-modal">
        <div className="clone-app-addons-list">{this.getAddons()}</div>
      </div>
    );
  }
});